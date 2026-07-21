const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const CATEGORIES = [
  { id: uuidv4(), name: 'Electronics', slug: 'electronics', icon: '💻', color: '#3b5bf5', sort_order: 1 },
  { id: uuidv4(), name: 'Fashion', slug: 'fashion', icon: '👗', color: '#ff24c2', sort_order: 2 },
  { id: uuidv4(), name: 'Home & Garden', slug: 'home', icon: '🏠', color: '#10b981', sort_order: 3 },
  { id: uuidv4(), name: 'Sports & Outdoors', slug: 'sports', icon: '⚽', color: '#f59e0b', sort_order: 4 },
  { id: uuidv4(), name: 'Beauty & Health', slug: 'beauty', icon: '💄', color: '#ec4899', sort_order: 5 },
  { id: uuidv4(), name: 'Books & Media', slug: 'books', icon: '📚', color: '#8b5cf6', sort_order: 6 },
  { id: uuidv4(), name: 'Toys & Games', slug: 'toys', icon: '🎮', color: '#ef4444', sort_order: 7 },
  { id: uuidv4(), name: 'Food & Drink', slug: 'food', icon: '🍕', color: '#f97316', sort_order: 8 },
  { id: uuidv4(), name: 'Automotive', slug: 'automotive', icon: '🚗', color: '#6b7280', sort_order: 9 },
  { id: uuidv4(), name: 'Health & Wellness', slug: 'health', icon: '💊', color: '#14b8a6', sort_order: 10 },
];

// Real product images from Unsplash (images.unsplash.com is in next.config.js allowed list)
const PRODUCT_IMAGES = {
  // Electronics
  'Sony WH-1000XM5 Wireless Headphones': [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop',
  ],
  'Apple AirPods Pro (2nd Generation)': [
    'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1588423771073-b8903fead85f?w=600&h=600&fit=crop',
  ],
  'Samsung 65" QLED 4K Smart TV': [
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600&h=600&fit=crop',
  ],
  'Apple Watch Series 9': [
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
  ],
  'iPad Air 5th Generation': [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=600&fit=crop',
  ],
  'Mechanical Gaming Keyboard RGB': [
    'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop',
  ],
  'Wireless Charging Pad 15W': [
    'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=600&fit=crop',
  ],
  'USB-C Hub 7-in-1': [
    'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
  ],
  // Fashion
  'Premium Leather Messenger Bag': [
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
  ],
  'Nike Air Max 270': [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop',
  ],
  'Classic Denim Jacket': [
    'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=600&h=600&fit=crop',
  ],
  'Minimalist Silver Watch': [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=600&h=600&fit=crop',
  ],
  'Cashmere Blend Sweater': [
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=600&fit=crop',
  ],
  // Home & Garden
  'Dyson V15 Detect Vacuum': [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&h=600&fit=crop',
  ],
  'Instant Pot Duo 7-in-1': [
    'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop',
  ],
  'Ergonomic Office Chair': [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop',
  ],
  'Smart LED Desk Lamp': [
    'https://images.unsplash.com/photo-1534073737927-85f1ebff1f5d?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop',
  ],
  'Scented Soy Candle Set': [
    'https://images.unsplash.com/photo-1602178506-32f2f8ba6f45?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1608181831718-c9f3be2ee8e4?w=600&h=600&fit=crop',
  ],
  // Sports
  'Yoga Mat Premium Non-Slip': [
    'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600&h=600&fit=crop',
  ],
  'Fitness Resistance Bands Set': [
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&h=600&fit=crop',
  ],
  'Hydro Flask 32oz Water Bottle': [
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1504980989-a1c7c1803f33?w=600&h=600&fit=crop',
  ],
  "Running Shoes Men's Lightweight": [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&h=600&fit=crop',
  ],
  // Beauty & Health
  'Vitamin C Serum 20%': [
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop',
  ],
  'Electric Face Massager': [
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600&h=600&fit=crop',
  ],
  'Natural Skincare Gift Set': [
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&h=600&fit=crop',
  ],
  // Books
  'Atomic Habits - James Clear': [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=600&fit=crop',
  ],
  'The Psychology of Money': [
    'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=600&fit=crop',
  ],
  'Kindle Paperwhite (16GB)': [
    'https://images.unsplash.com/photo-1592434134753-a70baf7979d5?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=600&fit=crop',
  ],
  // Toys
  'LEGO Technic Supercar': [
    'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
  ],
  'RC Monster Truck 4WD': [
    'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=600&h=600&fit=crop',
  ],
};

function makeProducts(categories, vendorId) {
  const catMap = Object.fromEntries(categories.map(c => [c.slug, c.id]));
  const products = [
    // Electronics
    { name: 'Sony WH-1000XM5 Wireless Headphones', category: 'electronics', price: 279.99, compare_price: 399.99, stock: 150, featured: true, description: 'Industry-leading noise canceling headphones with 30-hour battery life. Premium sound quality with Auto NC Optimizer that automatically optimizes noise canceling.' },
    { name: 'Apple AirPods Pro (2nd Generation)', category: 'electronics', price: 199.00, compare_price: 249.00, stock: 200, featured: true, description: 'Active Noise Cancellation for immersive sound. Adaptive Transparency lets you interact with the world around you. Spatial Audio with dynamic head tracking.' },
    { name: 'Samsung 65" QLED 4K Smart TV', category: 'electronics', price: 899.99, compare_price: 1299.99, stock: 45, featured: false, description: 'Quantum Dot technology produces 100% Color Volume with the Quantum HDR. Real Depth Enhancer creates a more immersive viewing experience.' },
    { name: 'Apple Watch Series 9', category: 'electronics', price: 399.00, compare_price: 429.00, stock: 100, featured: true, description: 'The most powerful Apple Watch yet. Advanced sensors for comprehensive health monitoring including blood oxygen and ECG.' },
    { name: 'iPad Air 5th Generation', category: 'electronics', price: 599.00, compare_price: 749.00, stock: 80, featured: false, description: 'Supercharged by the Apple M1 chip. Stunning 10.9-inch Liquid Retina display with True Tone.' },
    { name: 'Mechanical Gaming Keyboard RGB', category: 'electronics', price: 89.99, compare_price: 129.99, stock: 300, featured: false, description: 'Tactile mechanical switches with customizable RGB lighting. N-key rollover and anti-ghosting for competitive gaming.' },
    { name: 'Wireless Charging Pad 15W', category: 'electronics', price: 29.99, compare_price: 49.99, stock: 500, featured: false, description: 'Fast wireless charging pad compatible with all Qi-enabled devices. LED indicator and anti-slip surface.' },
    { name: 'USB-C Hub 7-in-1', category: 'electronics', price: 49.99, compare_price: 79.99, stock: 400, featured: false, description: '7-in-1 USB-C hub with 4K HDMI, USB 3.0 ports, SD card reader, and 100W PD charging.' },

    // Fashion
    { name: 'Premium Leather Messenger Bag', category: 'fashion', price: 129.99, compare_price: 199.99, stock: 80, featured: true, description: 'Handcrafted full-grain leather messenger bag. Fits 15" laptops with multiple organized compartments.' },
    { name: 'Nike Air Max 270', category: 'fashion', price: 89.99, compare_price: 150.00, stock: 200, featured: false, description: 'Lightweight and breathable upper with Max Air 270 unit for incredible underfoot cushioning.' },
    { name: 'Classic Denim Jacket', category: 'fashion', price: 69.99, compare_price: 120.00, stock: 150, featured: false, description: 'Timeless denim jacket crafted from premium cotton denim. Classic fit with a modern touch.' },
    { name: 'Minimalist Silver Watch', category: 'fashion', price: 159.99, compare_price: 250.00, stock: 60, featured: true, description: 'Swiss-inspired minimalist timepiece with sapphire crystal glass. Water resistant to 50 meters.' },
    { name: 'Cashmere Blend Sweater', category: 'fashion', price: 89.99, compare_price: 150.00, stock: 100, featured: false, description: '70% cashmere, 30% merino wool blend. Incredibly soft with a relaxed, cozy fit.' },

    // Home & Garden
    { name: 'Dyson V15 Detect Vacuum', category: 'home', price: 549.99, compare_price: 749.99, stock: 40, featured: true, description: 'Powerful suction with laser dust detection. 60 minutes of fade-free power for whole-home cleaning.' },
    { name: 'Instant Pot Duo 7-in-1', category: 'home', price: 79.99, compare_price: 129.99, stock: 200, featured: false, description: '7-in-1 electric pressure cooker. Pressure cook, slow cook, rice cooker, steamer, sauté, yogurt maker, and warmer.' },
    { name: 'Ergonomic Office Chair', category: 'home', price: 349.99, compare_price: 599.99, stock: 50, featured: true, description: 'Breathable mesh back with lumbar support. Height adjustable armrests and tilt tension control.' },
    { name: 'Smart LED Desk Lamp', category: 'home', price: 49.99, compare_price: 79.99, stock: 300, featured: false, description: 'Touch-sensitive dimming with 5 color temperatures. USB charging port and memory function.' },
    { name: 'Scented Soy Candle Set', category: 'home', price: 34.99, compare_price: 55.00, stock: 500, featured: false, description: 'Set of 4 premium soy wax candles with natural essential oil fragrances. 40+ hour burn time each.' },

    // Sports
    { name: 'Yoga Mat Premium Non-Slip', category: 'sports', price: 44.99, compare_price: 79.99, stock: 300, featured: false, description: 'Eco-friendly TPE yoga mat with alignment lines. Extra thick 6mm cushioning for joint support.' },
    { name: 'Fitness Resistance Bands Set', category: 'sports', price: 24.99, compare_price: 44.99, stock: 600, featured: false, description: 'Set of 5 resistance bands in different strengths. Perfect for strength training, stretching, and physical therapy.' },
    { name: 'Hydro Flask 32oz Water Bottle', category: 'sports', price: 44.95, compare_price: 64.95, stock: 400, featured: false, description: 'Double-wall vacuum insulation keeps drinks cold 24 hours or hot 12 hours. BPA-free and dishwasher safe.' },
    { name: 'Running Shoes Men\'s Lightweight', category: 'sports', price: 74.99, compare_price: 120.00, stock: 250, featured: true, description: 'Lightweight breathable mesh upper with responsive foam midsole. Perfect for road running and daily training.' },

    // Beauty & Health
    { name: 'Vitamin C Serum 20%', category: 'beauty', price: 28.99, compare_price: 49.99, stock: 500, featured: false, description: 'High-potency Vitamin C + Hyaluronic Acid + Vitamin E. Brightens skin, reduces dark spots.' },
    { name: 'Electric Face Massager', category: 'beauty', price: 39.99, compare_price: 79.99, stock: 200, featured: true, description: 'T-shaped facial massager with 6 massage heads. Helps reduce puffiness and improve circulation.' },
    { name: 'Natural Skincare Gift Set', category: 'beauty', price: 55.00, compare_price: 89.00, stock: 150, featured: false, description: 'Curated set of 5 natural, cruelty-free skincare products. Perfect gift for skincare enthusiasts.' },

    // Books
    { name: 'Atomic Habits - James Clear', category: 'books', price: 16.99, compare_price: 27.00, stock: 1000, featured: false, description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones. The #1 New York Times bestseller.' },
    { name: 'The Psychology of Money', category: 'books', price: 14.99, compare_price: 22.00, stock: 800, featured: false, description: 'Timeless lessons on wealth, greed, and happiness by Morgan Housel.' },
    { name: 'Kindle Paperwhite (16GB)', category: 'books', price: 139.99, compare_price: 159.99, stock: 100, featured: true, description: 'Thinner and lighter than before with 3 months of Kindle Unlimited included. 20% faster page turns.' },

    // Toys
    { name: 'LEGO Technic Supercar', category: 'toys', price: 89.99, compare_price: 119.99, stock: 80, featured: true, description: 'Advanced LEGO Technic set with 1,367 pieces. Features working steering and detailed engine.' },
    { name: 'RC Monster Truck 4WD', category: 'toys', price: 54.99, compare_price: 89.99, stock: 120, featured: false, description: '4WD remote control monster truck with LED lights. High-speed off-road performance.' },
  ];

  return products.map((p) => ({
    id: uuidv4(),
    slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    name: p.name,
    description: p.description,
    short_description: p.description.substring(0, 100),
    price: p.price,
    compare_price: p.compare_price || null,
    sku: 'SKU-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    stock_quantity: p.stock,
    category_id: catMap[p.category],
    vendor_id: vendorId,
    images: JSON.stringify(PRODUCT_IMAGES[p.name] || [`https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop`]),
    tags: JSON.stringify([p.category, 'popular']),
    is_active: true,
    is_featured: p.featured || false,
    is_digital: false,
    sold_count: Math.floor(Math.random() * 500),
  }));
}

async function seed() {
  const client = await pool.connect();
  try {
    // Skip seeding entirely if products already exist
    const { rows } = await client.query('SELECT COUNT(*)::int AS count FROM products');
    if (rows[0].count > 0) {
      console.log('✅ Database already seeded — skipping.');
      return;
    }
    console.log('🌱 Seeding database...');

    // Categories
    console.log('  → Seeding categories...');
    for (const cat of CATEGORIES) {
      await client.query(`
        INSERT INTO categories (id, name, slug, icon, color, sort_order, is_active, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, true, NOW())
        ON CONFLICT (slug) DO NOTHING
      `, [cat.id, cat.name, cat.slug, cat.icon, cat.color, cat.sort_order]);
    }

    // Products
    console.log('  → Seeding products...');
    const categories = await client.query('SELECT * FROM categories');
    const products = makeProducts(categories.rows, null);

    for (const p of products) {
      await client.query(`
        INSERT INTO products (id, slug, name, description, short_description, price, compare_price, sku, stock_quantity, sold_count, category_id, vendor_id, images, tags, is_active, is_featured, is_digital, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13::jsonb, $14::jsonb, $15, $16, $17, NOW(), NOW())
        ON CONFLICT (slug) DO UPDATE SET
          images = EXCLUDED.images,
          description = EXCLUDED.description,
          price = EXCLUDED.price,
          compare_price = EXCLUDED.compare_price,
          is_featured = EXCLUDED.is_featured,
          updated_at = NOW()
      `, [p.id, p.slug, p.name, p.description, p.short_description, p.price, p.compare_price, p.sku, p.stock_quantity, p.sold_count, p.category_id, p.vendor_id, p.images, p.tags, p.is_active, p.is_featured, p.is_digital]);
    }

    // Coupons
    console.log('  → Seeding coupons...');
    const coupons = [
      { code: 'WELCOME10', type: 'percentage', value: 10, min_order_amount: 0 },
      { code: 'SAVE20', type: 'percentage', value: 20, min_order_amount: 100 },
      { code: 'SUMMER15', type: 'percentage', value: 15, min_order_amount: 50 },
      { code: 'FREESHIP', type: 'free_shipping', value: 0, min_order_amount: 25 },
      { code: 'FLASH50', type: 'fixed', value: 50, min_order_amount: 150 },
    ];
    for (const coupon of coupons) {
      await client.query(`
        INSERT INTO coupons (id, code, type, value, min_order_amount, is_active, created_at)
        VALUES ($1, $2, $3, $4, $5, true, NOW())
        ON CONFLICT (code) DO NOTHING
      `, [uuidv4(), coupon.code, coupon.type, coupon.value, coupon.min_order_amount]);
    }

    console.log('✅ Seeding complete! Categories, products and coupons are ready.');
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
