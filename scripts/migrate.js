const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('🔄 Running database migrations...');

    await client.query(`
      -- Enable UUID extension
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      -- Users table
      CREATE TABLE IF NOT EXISTS users (
        id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email       TEXT UNIQUE NOT NULL,
        name        TEXT NOT NULL,
        password_hash TEXT NOT NULL DEFAULT '',
        role        TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer','vendor','admin','super_admin','support')),
        avatar_url  TEXT,
        phone       TEXT,
        is_active   BOOLEAN NOT NULL DEFAULT true,
        last_login_at TIMESTAMPTZ,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- Categories
      CREATE TABLE IF NOT EXISTS categories (
        id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name        TEXT NOT NULL,
        slug        TEXT UNIQUE NOT NULL,
        description TEXT,
        image       TEXT,
        icon        TEXT,
        color       TEXT,
        parent_id   UUID REFERENCES categories(id),
        sort_order  INT NOT NULL DEFAULT 0,
        is_active   BOOLEAN NOT NULL DEFAULT true,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- Vendors
      CREATE TABLE IF NOT EXISTS vendors (
        id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id         UUID NOT NULL REFERENCES users(id),
        store_name      TEXT NOT NULL,
        slug            TEXT UNIQUE NOT NULL,
        description     TEXT,
        logo_url        TEXT,
        banner_url      TEXT,
        commission_rate NUMERIC(5,2) NOT NULL DEFAULT 10.00,
        rating          NUMERIC(3,2) NOT NULL DEFAULT 0,
        review_count    INT NOT NULL DEFAULT 0,
        product_count   INT NOT NULL DEFAULT 0,
        total_sales     NUMERIC(12,2) NOT NULL DEFAULT 0,
        is_verified     BOOLEAN NOT NULL DEFAULT false,
        status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('pending','active','suspended')),
        created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- Products
      CREATE TABLE IF NOT EXISTS products (
        id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        slug              TEXT UNIQUE NOT NULL,
        name              TEXT NOT NULL,
        description       TEXT,
        short_description TEXT,
        price             NUMERIC(12,2) NOT NULL,
        compare_price     NUMERIC(12,2),
        cost_price        NUMERIC(12,2),
        sku               TEXT UNIQUE NOT NULL,
        stock_quantity    INT NOT NULL DEFAULT 0,
        sold_count        INT NOT NULL DEFAULT 0,
        category_id       UUID REFERENCES categories(id),
        vendor_id         UUID REFERENCES vendors(id),
        images            JSONB NOT NULL DEFAULT '[]',
        tags              JSONB NOT NULL DEFAULT '[]',
        is_active         BOOLEAN NOT NULL DEFAULT true,
        is_featured       BOOLEAN NOT NULL DEFAULT false,
        is_digital        BOOLEAN NOT NULL DEFAULT false,
        weight            NUMERIC(8,2),
        dimensions        JSONB,
        meta_title        TEXT,
        meta_description  TEXT,
        created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- Product variants
      CREATE TABLE IF NOT EXISTS product_variants (
        id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        product_id     UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        name           TEXT NOT NULL,
        options        JSONB NOT NULL DEFAULT '{}',
        price          NUMERIC(12,2),
        stock_quantity INT NOT NULL DEFAULT 0,
        sku            TEXT,
        image          TEXT,
        created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- Orders
      CREATE TABLE IF NOT EXISTS orders (
        id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        order_number     TEXT UNIQUE NOT NULL,
        user_id          UUID NOT NULL REFERENCES users(id),
        status           TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled','refunded')),
        payment_status   TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed','refunded')),
        subtotal         NUMERIC(12,2) NOT NULL,
        discount         NUMERIC(12,2) NOT NULL DEFAULT 0,
        shipping_cost    NUMERIC(12,2) NOT NULL DEFAULT 0,
        tax              NUMERIC(12,2) NOT NULL DEFAULT 0,
        total            NUMERIC(12,2) NOT NULL,
        currency         TEXT NOT NULL DEFAULT 'USD',
        shipping_address JSONB NOT NULL DEFAULT '{}',
        billing_address  JSONB,
        notes            TEXT,
        tracking_number  TEXT,
        coupon_code      TEXT,
        created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- Order items
      CREATE TABLE IF NOT EXISTS order_items (
        id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        order_id       UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        product_id     UUID REFERENCES products(id),
        product_name   TEXT NOT NULL,
        product_image  TEXT,
        variant        TEXT,
        quantity       INT NOT NULL,
        unit_price     NUMERIC(12,2) NOT NULL,
        total_price    NUMERIC(12,2) NOT NULL,
        vendor_id      UUID REFERENCES vendors(id),
        created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- Reviews
      CREATE TABLE IF NOT EXISTS reviews (
        id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        product_id    UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        user_id       UUID NOT NULL REFERENCES users(id),
        order_id      UUID REFERENCES orders(id),
        rating        INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
        title         TEXT,
        body          TEXT,
        is_verified   BOOLEAN NOT NULL DEFAULT false,
        helpful_count INT NOT NULL DEFAULT 0,
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- Coupons
      CREATE TABLE IF NOT EXISTS coupons (
        id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        code             TEXT UNIQUE NOT NULL,
        type             TEXT NOT NULL CHECK (type IN ('percentage','fixed','free_shipping')),
        value            NUMERIC(10,2) NOT NULL,
        min_order_amount NUMERIC(12,2),
        max_discount     NUMERIC(12,2),
        usage_limit      INT,
        used_count       INT NOT NULL DEFAULT 0,
        expires_at       TIMESTAMPTZ,
        is_active        BOOLEAN NOT NULL DEFAULT true,
        created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- Wishlists
      CREATE TABLE IF NOT EXISTS wishlists (
        id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id    UUID NOT NULL REFERENCES users(id),
        product_id UUID NOT NULL REFERENCES products(id),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(user_id, product_id)
      );

      -- Addresses
      CREATE TABLE IF NOT EXISTS addresses (
        id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id     UUID NOT NULL REFERENCES users(id),
        type        TEXT NOT NULL DEFAULT 'shipping' CHECK (type IN ('shipping','billing')),
        first_name  TEXT NOT NULL,
        last_name   TEXT NOT NULL,
        company     TEXT,
        line1       TEXT NOT NULL,
        line2       TEXT,
        city        TEXT NOT NULL,
        state       TEXT NOT NULL,
        postal_code TEXT NOT NULL,
        country     TEXT NOT NULL DEFAULT 'US',
        phone       TEXT,
        is_default  BOOLEAN NOT NULL DEFAULT false,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- Analytics events
      CREATE TABLE IF NOT EXISTS analytics_events (
        id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        event_type TEXT NOT NULL,
        user_id    UUID REFERENCES users(id),
        session_id TEXT,
        data       JSONB NOT NULL DEFAULT '{}',
        ip_address TEXT,
        user_agent TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- Notifications
      CREATE TABLE IF NOT EXISTS notifications (
        id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id    UUID NOT NULL REFERENCES users(id),
        type       TEXT NOT NULL,
        title      TEXT NOT NULL,
        message    TEXT NOT NULL,
        data       JSONB NOT NULL DEFAULT '{}',
        is_read    BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- Indexes for performance
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
      CREATE INDEX IF NOT EXISTS idx_products_vendor ON products(vendor_id);
      CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
      CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
      CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
      CREATE INDEX IF NOT EXISTS idx_products_name_gin ON products USING gin(to_tsvector('english', name));
      CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
      CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
      CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
      CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
      CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events(event_type);
      CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at);

      -- Cart items (server-side persistent cart)
      CREATE TABLE IF NOT EXISTS cart_items (
        id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        product_id     TEXT NOT NULL,
        name           TEXT NOT NULL,
        price          NUMERIC(12,2) NOT NULL,
        original_price NUMERIC(12,2),
        image          TEXT,
        quantity       INT NOT NULL DEFAULT 1,
        variant        TEXT NOT NULL DEFAULT '',
        vendor_id      TEXT,
        vendor_name    TEXT,
        created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      -- Additive column migrations (idempotent)
      ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS firebase_uid TEXT;
    `);

    // Create unique index on firebase_uid if it doesn't exist
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid) WHERE firebase_uid IS NOT NULL;
    `);

    // Indexes for cart_items
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_cart_items_unique ON cart_items(user_id, product_id, variant);
      CREATE INDEX IF NOT EXISTS idx_cart_items_user ON cart_items(user_id);
      CREATE INDEX IF NOT EXISTS idx_wishlists_user ON wishlists(user_id);
    `);

    // Demo accounts are now preserved across restarts (seeded by seed.js)

    console.log('✅ Migration complete!');
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
