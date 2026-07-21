import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// ── Intent detection ─────────────────────────────────────────────────────────
// Covers the full automation-trigger vocabulary from the AI Company spec:
// welcome, deals, categories, order help, returns, shipping, wishlist, loyalty,
// referral, VIP, coupons, flash-sale, reviews, back-in-stock, price-drop,
// recommendations, win-back, vendor, account, support escalation, and general search.

type Intent =
  | 'greeting'
  | 'search_products'
  | 'deals'
  | 'flash_sale'
  | 'categories'
  | 'order_help'
  | 'returns_refund'
  | 'shipping'
  | 'wishlist'
  | 'loyalty'
  | 'referral'
  | 'vip'
  | 'coupons'
  | 'recommendations'
  | 'reviews'
  | 'back_in_stock'
  | 'price_drop'
  | 'birthday'
  | 'vendor'
  | 'account'
  | 'support'
  | 'sustainability'
  | 'fallback';

type Department =
  | 'Shopping Guide'
  | 'Deals & Offers'
  | 'Customer Success'
  | 'Sales & Recommendations'
  | 'Loyalty & Rewards'
  | 'Vendor Relations'
  | 'Support';

interface IntentResult {
  intent: Intent;
  department: Department;
}

function detectIntent(message: string): IntentResult {
  const m = message.toLowerCase();

  // Greeting / onboarding
  if (/\b(hi|hello|hey|howdy|what can you do|help|start|begin|new here)\b/.test(m))
    return { intent: 'greeting', department: 'Shopping Guide' };

  // Flash sale (before generic deals to be more specific)
  if (/\b(flash\s*sale|lightning\s*deal|limited\s*time|today only|ending\s*soon|countdown|timer)\b/.test(m))
    return { intent: 'flash_sale', department: 'Deals & Offers' };

  // Deals / discounts
  if (/\b(deals?|sales?|offers?|discounts?|promo|coupon|cheap|bargain|save|saving|off|markdown)\b/.test(m))
    return { intent: 'deals', department: 'Deals & Offers' };

  // Coupons specifically
  if (/\b(coupon|voucher|promo\s*code|discount\s*code|redeem|code)\b/.test(m))
    return { intent: 'coupons', department: 'Deals & Offers' };

  // Returns & refunds
  if (/\b(return|refund|exchange|money\s*back|send\s*back|dispute|damaged|broken|wrong\s*item)\b/.test(m))
    return { intent: 'returns_refund', department: 'Customer Success' };

  // Shipping
  if (/\b(ship|deliver|dispatch|freight|postage|arrive|arrival|track\s*package|how\s*long|express|standard\s*delivery)\b/.test(m))
    return { intent: 'shipping', department: 'Customer Success' };

  // Order help (after shipping so shipping-specific gets caught first)
  if (/\b(order|track|cancel|status|invoice|receipt|my\s*purchase|confirmation)\b/.test(m))
    return { intent: 'order_help', department: 'Customer Success' };

  // Wishlist
  if (/\b(wishlist|wish\s*list|save|saved|favourite|favorite|later|watch\s*list)\b/.test(m))
    return { intent: 'wishlist', department: 'Sales & Recommendations' };

  // Back in stock
  if (/\b(back\s*in\s*stock|restock|notify\s*me|alert\s*me|available\s*again|out\s*of\s*stock)\b/.test(m))
    return { intent: 'back_in_stock', department: 'Sales & Recommendations' };

  // Price drop
  if (/\b(price\s*drop|price\s*alert|cheaper|went\s*down|lower\s*price|watching\s*price|price\s*watch)\b/.test(m))
    return { intent: 'price_drop', department: 'Sales & Recommendations' };

  // Recommendations (must come after specific product searches)
  if (/\b(recommend|suggest|similar|like\s*this|you\s*might|personaliz|for\s*me|trending|popular|top\s*rated|best\s*seller)\b/.test(m))
    return { intent: 'recommendations', department: 'Sales & Recommendations' };

  // Loyalty / rewards
  if (/\b(loyalty|points|rewards?|earn|redeem\s*points|tier|gold|platinum|silver|member|membership|vip\s*point)\b/.test(m))
    return { intent: 'loyalty', department: 'Loyalty & Rewards' };

  // VIP / exclusive
  if (/\b(vip|exclusive|early\s*access|private\s*sale|invitation|premium\s*member|high\s*value)\b/.test(m))
    return { intent: 'vip', department: 'Loyalty & Rewards' };

  // Referral
  if (/\b(refer|referral|invite|friend|share|earn\s*for|bring\s*a\s*friend|affiliate|commission)\b/.test(m))
    return { intent: 'referral', department: 'Loyalty & Rewards' };

  // Reviews
  if (/\b(review|rating|feedback|testimonial|star|rated|opinion|experience)\b/.test(m))
    return { intent: 'reviews', department: 'Customer Success' };

  // Birthday / anniversary
  if (/\b(birthday|anniversary|celebrate|special\s*day|gift\s*for\s*me|born)\b/.test(m))
    return { intent: 'birthday', department: 'Loyalty & Rewards' };

  // Categories
  if (/\b(categor(y|ies)?|department|section|browse|types\s*of|shop\s*by)\b/.test(m))
    return { intent: 'categories', department: 'Shopping Guide' };

  // Vendor / seller
  if (/\b(sell|vendor|seller|merchant|store|list\s*my|become\s*a\s*seller|start\s*selling|my\s*shop|marketplace)\b/.test(m))
    return { intent: 'vendor', department: 'Vendor Relations' };

  // Account
  if (/\b(account|profile|password|login|sign\s*in|register|sign\s*up|email\s*change|personal\s*info)\b/.test(m))
    return { intent: 'account', department: 'Support' };

  // Sustainability / brand
  if (/\b(sustainab|eco|environment|green|ethical|brand|about\s*vitis|who\s*are\s*you|mission|values)\b/.test(m))
    return { intent: 'sustainability', department: 'Shopping Guide' };

  // Support escalation
  if (/\b(complain|issue|problem|not\s*working|help\s*me|urgent|escalate|speak\s*to|human|agent|manager)\b/.test(m))
    return { intent: 'support', department: 'Support' };

  return { intent: 'search_products', department: 'Shopping Guide' };
}

// ── Database helpers ─────────────────────────────────────────────────────────

async function searchProducts(keywords: string[], limit = 5) {
  if (!keywords.length) return [];
  const altPattern = keywords.map((k) => `%${k}%`);
  const conditions = altPattern
    .map((_, i) => `(p.name ILIKE $${i + 1} OR p.description ILIKE $${i + 1} OR p.tags::text ILIKE $${i + 1})`)
    .join(' OR ');
  return query(
    `SELECT p.name, p.slug, p.price, p.compare_price, p.images, p.stock_quantity,
            p.sold_count, v.store_name as vendor_name
     FROM products p
     LEFT JOIN vendors v ON v.id = p.vendor_id
     WHERE p.is_active = true AND (${conditions})
     ORDER BY p.is_featured DESC, p.sold_count DESC
     LIMIT $${altPattern.length + 1}`,
    [...altPattern, limit]
  );
}

async function getDeals(limit = 5) {
  return query(
    `SELECT p.name, p.slug, p.price, p.compare_price, p.images,
            ROUND(((p.compare_price - p.price) / p.compare_price) * 100) as discount_pct
     FROM products p
     WHERE p.is_active = true AND p.compare_price > p.price
     ORDER BY discount_pct DESC
     LIMIT $1`,
    [limit]
  );
}

async function getCategories() {
  return query(
    `SELECT c.name, c.slug, c.icon, COUNT(p.id)::int as product_count
     FROM categories c
     LEFT JOIN products p ON p.category_id = c.id AND p.is_active = true
     WHERE c.is_active = true
     GROUP BY c.id, c.name, c.slug, c.icon
     ORDER BY product_count DESC
     LIMIT 10`,
    []
  );
}

async function getBestSellers(limit = 5) {
  return query(
    `SELECT p.name, p.slug, p.price, p.compare_price, p.images, p.sold_count,
            c.name as category_name
     FROM products p
     LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.is_active = true AND p.stock_quantity > 0
     ORDER BY p.sold_count DESC
     LIMIT $1`,
    [limit]
  );
}

async function getTrendingProducts(limit = 5) {
  return query(
    `SELECT p.name, p.slug, p.price, p.compare_price, p.images, p.sold_count, p.is_featured,
            c.name as category_name
     FROM products p
     LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.is_active = true AND p.stock_quantity > 0
     ORDER BY p.is_featured DESC, p.sold_count DESC, p.created_at DESC
     LIMIT $1`,
    [limit]
  );
}

async function getFeaturedProducts(limit = 5) {
  return query(
    `SELECT p.name, p.slug, p.price, p.compare_price, p.images, p.stock_quantity,
            v.store_name as vendor_name
     FROM products p
     LEFT JOIN vendors v ON v.id = p.vendor_id
     WHERE p.is_active = true AND p.is_featured = true
     ORDER BY p.sold_count DESC
     LIMIT $1`,
    [limit]
  );
}

async function getActiveCoupons(limit = 3) {
  return query(
    `SELECT code, discount_type, discount_value, minimum_order, usage_limit, used_count,
            expires_at
     FROM coupons
     WHERE is_active = true AND (expires_at IS NULL OR expires_at > NOW())
       AND (usage_limit IS NULL OR used_count < usage_limit)
     ORDER BY discount_value DESC
     LIMIT $1`,
    [limit]
  );
}

async function getLowStockProducts(limit = 3) {
  return query(
    `SELECT p.name, p.slug, p.price, p.stock_quantity
     FROM products p
     WHERE p.is_active = true AND p.stock_quantity > 0 AND p.stock_quantity <= 5
     ORDER BY p.stock_quantity ASC
     LIMIT $1`,
    [limit]
  );
}

// ── Keyword extraction ───────────────────────────────────────────────────────

function extractKeywords(message: string): string[] {
  const stopwords = new Set([
    'find', 'show', 'get', 'give', 'me', 'a', 'an', 'the', 'i', 'want',
    'need', 'looking', 'for', 'some', 'any', 'good', 'best', 'great',
    'please', 'can', 'you', 'under', 'over', 'about', 'like', 'what',
    'are', 'is', 'have', 'has', 'do', 'does', 'its', 'their', 'there',
    'which', 'how', 'that', 'this', 'these', 'those', 'with', 'and', 'or',
  ]);
  return message
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopwords.has(w));
}

// ── Product formatter ────────────────────────────────────────────────────────

function formatProduct(p: any, showDiscount = true): string {
  const price = `$${parseFloat(p.price).toFixed(2)}`;
  const strike = (showDiscount && p.compare_price)
    ? ` ~~$${parseFloat(p.compare_price).toFixed(2)}~~` : '';
  const stock = p.stock_quantity !== undefined
    ? (p.stock_quantity > 0 ? '✅ In stock' : '⚠️ Out of stock') : '';
  const vendor = p.vendor_name ? ` · ${p.vendor_name}` : '';
  const category = p.category_name ? ` · ${p.category_name}` : '';
  return `**${p.name}** — ${price}${strike}\n${stock}${vendor}${category}`;
}

// ── Department label ─────────────────────────────────────────────────────────

function deptHeader(dept: Department): string {
  const icons: Record<Department, string> = {
    'Shopping Guide': '🛍️',
    'Deals & Offers': '🔥',
    'Customer Success': '💬',
    'Sales & Recommendations': '⭐',
    'Loyalty & Rewards': '👑',
    'Vendor Relations': '🏪',
    'Support': '🛟',
  };
  return `*${icons[dept]} Vitis ${dept}*\n\n`;
}

// ── Build response ───────────────────────────────────────────────────────────

async function buildReply(message: string): Promise<string> {
  const { intent, department } = detectIntent(message);
  const header = deptHeader(department);

  // ── Greeting ──────────────────────────────────────────────────────────────
  if (intent === 'greeting') {
    return (
      header +
      "Hi there! 👋 I'm **Vitis Assistant** — your AI-powered shopping companion backed by a full team of intelligent specialists.\n\n" +
      "Here's what our AI team can help you with:\n\n" +
      "🔍 **Find products** — search by name, type, or budget\n" +
      "🔥 **Deals & flash sales** — today's best discounts\n" +
      "📦 **Order tracking** — check your order status\n" +
      "🔄 **Returns & refunds** — hassle-free return help\n" +
      "👑 **Loyalty & rewards** — points, VIP perks, referrals\n" +
      "🎂 **Birthday & anniversary offers** — exclusive gifts\n" +
      "💌 **Coupons & promo codes** — active vouchers\n" +
      "⭐ **Personalized picks** — products curated for you\n" +
      "🏪 **Become a vendor** — sell on Vitis Marketplace\n\n" +
      "What can I help you with today?"
    );
  }

  // ── Flash sale ────────────────────────────────────────────────────────────
  if (intent === 'flash_sale') {
    const deals = await getDeals(8);
    const lowStock = await getLowStockProducts(3);
    let reply = header + "⚡ **Flash Sale — Limited Stock, Real Savings!**\n\n";
    if (deals.length) {
      const lines = deals.map((d: any) => {
        const pct = d.discount_pct ? ` **(${d.discount_pct}% OFF)**` : '';
        return `• **${d.name}** — $${parseFloat(d.price).toFixed(2)}${pct}`;
      });
      reply += `🏷️ **Top Discounts Right Now:**\n${lines.join('\n')}\n\n`;
    }
    if (lowStock.length) {
      reply += `⚠️ **Almost Gone — Act Fast:**\n`;
      reply += lowStock.map((p: any) => `• **${p.name}** — only ${p.stock_quantity} left!`).join('\n');
      reply += '\n\n';
    }
    reply += "Use code **WELCOME10** for an extra 10% off your first order!\n\nWant me to reserve something for you?";
    return reply;
  }

  // ── Deals ─────────────────────────────────────────────────────────────────
  if (intent === 'deals') {
    const deals = await getDeals(6);
    if (!deals.length) {
      return header + "No active discounts right now — but new deals drop every day! 🔥\n\nTry browsing **Flash Sales** or ask me about specific products.";
    }
    const lines = deals.map((d: any) => {
      const pct = d.discount_pct ? ` (${d.discount_pct}% off)` : '';
      return `• **${d.name}** — $${parseFloat(d.price).toFixed(2)}${pct}`;
    });
    return (
      header +
      `🔥 **Today's Best Deals:**\n\n${lines.join('\n')}\n\n` +
      "💡 **Tip:** Use code **WELCOME10** for 10% off your first order.\n\n" +
      "Want details on any of these? Just ask!"
    );
  }

  // ── Coupons ───────────────────────────────────────────────────────────────
  if (intent === 'coupons') {
    const coupons = await getActiveCoupons(5);
    if (!coupons.length) {
      return (
        header +
        "No public coupons are live right now, but here are ways to unlock exclusive codes:\n\n" +
        "• 🎉 **Welcome code** — **WELCOME10** (10% off your first order)\n" +
        "• 👑 **Loyalty rewards** — earn points on purchases and redeem for discount codes\n" +
        "• 📬 **Newsletter** — subscribe for weekly promo drops\n" +
        "• 👫 **Referral program** — refer a friend, both of you get a reward\n\n" +
        "Want to know more about any of these?"
      );
    }
    const lines = coupons.map((c: any) => {
      const value = c.discount_type === 'percentage'
        ? `${c.discount_value}% off`
        : c.discount_type === 'fixed'
          ? `$${c.discount_value} off`
          : 'Free shipping';
      const minOrder = c.minimum_order ? ` (min. order $${c.minimum_order})` : '';
      const expiry = c.expires_at ? ` — expires ${new Date(c.expires_at).toLocaleDateString()}` : '';
      return `• **${c.code}** — ${value}${minOrder}${expiry}`;
    });
    return (
      header +
      `🎟️ **Active Coupon Codes:**\n\n${lines.join('\n')}\n\n` +
      "Apply codes at checkout. Need help using one?"
    );
  }

  // ── Categories ────────────────────────────────────────────────────────────
  if (intent === 'categories') {
    const cats = await getCategories();
    if (!cats.length) {
      return header + "Try browsing the **Products** page to see everything we carry!";
    }
    const lines = cats.map((c: any) => `• ${c.icon || '🛒'} **${c.name}** — ${c.product_count} products`);
    return (
      header +
      `🗂️ **Shop by Category:**\n\n${lines.join('\n')}\n\n` +
      "Tell me a category and I'll surface the best picks for you!"
    );
  }

  // ── Order help ────────────────────────────────────────────────────────────
  if (intent === 'order_help') {
    return (
      header +
      "📦 **Order Help — Customer Success AI**\n\n" +
      "Here's everything you need to know:\n\n" +
      "🔍 **Track an order** → **My Account → Orders** to see real-time status\n" +
      "❌ **Cancel an order** → possible before the order ships from **My Account**\n" +
      "🧾 **Download invoice** → available in **My Account → Orders → View Details**\n" +
      "📬 **Delivery estimate** → check your order confirmation email for your tracking number\n\n" +
      "**Typical timelines:**\n" +
      "• Standard shipping: 3–5 business days\n" +
      "• Express shipping: 1–2 business days\n" +
      "• International: 7–14 business days\n\n" +
      "Need help with a specific order? Let me know your order number and I'll do my best to assist."
    );
  }

  // ── Returns & refunds ─────────────────────────────────────────────────────
  if (intent === 'returns_refund') {
    return (
      header +
      "🔄 **Returns & Refunds — Customer Success AI**\n\n" +
      "We want you to be 100% happy with your purchase!\n\n" +
      "**Return Policy:**\n" +
      "• ✅ Items accepted within **30 days** of delivery\n" +
      "• ✅ Must be unused, in original packaging\n" +
      "• ✅ Free returns on damaged or wrong items\n" +
      "• ⚠️ Digital products and gift cards are non-refundable\n\n" +
      "**How to start a return:**\n" +
      "1. Go to **My Account → Orders**\n" +
      "2. Select the order and click **Request Return**\n" +
      "3. Choose your reason and preferred resolution (refund or exchange)\n" +
      "4. Print the prepaid return label (for eligible items)\n\n" +
      "**Refund timeline:** 3–5 business days after we receive your return.\n\n" +
      "Is there a specific order you'd like to return?"
    );
  }

  // ── Shipping ──────────────────────────────────────────────────────────────
  if (intent === 'shipping') {
    return (
      header +
      "🚚 **Shipping Information — Customer Success AI**\n\n" +
      "**Domestic Shipping Options:**\n" +
      "• 🐢 Standard (3–5 days) — Free on orders over $50\n" +
      "• ⚡ Express (1–2 days) — $9.99\n" +
      "• 🌙 Overnight — $19.99 (order before 2 PM)\n\n" +
      "**International Shipping:**\n" +
      "• 🌍 Standard (7–14 days) — from $14.99\n" +
      "• ✈️ Express international (3–5 days) — from $29.99\n\n" +
      "💡 **Pro tip:** Free standard shipping kicks in automatically on orders over $50 — use code **WELCOME10** to get closer!\n\n" +
      "Need a tracking update on an existing order?"
    );
  }

  // ── Wishlist ──────────────────────────────────────────────────────────────
  if (intent === 'wishlist') {
    const featured = await getFeaturedProducts(3);
    let reply =
      header +
      "❤️ **Wishlist — Save Products You Love**\n\n" +
      "Your wishlist lets you:\n" +
      "• 💾 Save items across sessions (sign in to persist)\n" +
      "• 📲 Get notified when a wishlisted item goes on sale\n" +
      "• 🔔 Receive back-in-stock alerts automatically\n" +
      "• 🎁 Share your wishlist with friends & family\n\n" +
      "**To add to wishlist:** click the ❤️ icon on any product card.\n\n";
    if (featured.length) {
      reply += "✨ **Popular products shoppers are saving right now:**\n";
      reply += featured.map((p: any) => `• **${p.name}** — $${parseFloat(p.price).toFixed(2)}`).join('\n');
      reply += '\n\n';
    }
    reply += "Want me to find something specific to add to your list?";
    return reply;
  }

  // ── Loyalty ───────────────────────────────────────────────────────────────
  if (intent === 'loyalty') {
    return (
      header +
      "👑 **Vitis Loyalty Program — Rewards & Perks**\n\n" +
      "Earn points every time you shop and unlock exclusive benefits!\n\n" +
      "**How to earn points:**\n" +
      "• 🛒 Every $1 spent = 10 points\n" +
      "• ⭐ Leave a product review = 50 points\n" +
      "• 👫 Refer a friend who buys = 200 points\n" +
      "• 🎂 Birthday bonus = 500 points\n" +
      "• 📬 Newsletter signup = 100 points\n\n" +
      "**Membership Tiers:**\n" +
      "• 🥉 **Bronze** (0–999 pts) — standard benefits\n" +
      "• 🥈 **Silver** (1,000–4,999 pts) — 5% bonus points, early sale access\n" +
      "• 🥇 **Gold** (5,000–14,999 pts) — 10% bonus points, free express shipping\n" +
      "• 💎 **Platinum** (15,000+ pts) — 15% bonus points, VIP support, exclusive drops\n\n" +
      "**Redeeming:** 1,000 points = $10 off your next order\n\n" +
      "Check your points balance in **My Account → Rewards**.\n\n" +
      "Would you like tips on the fastest way to level up?"
    );
  }

  // ── VIP ───────────────────────────────────────────────────────────────────
  if (intent === 'vip') {
    const deals = await getDeals(4);
    let reply =
      header +
      "💎 **VIP & Exclusive Access — Loyalty & Rewards AI**\n\n" +
      "As a Vitis VIP (Platinum member) you unlock:\n\n" +
      "• 🎯 **Early access** to new product launches (24 hrs before public)\n" +
      "• 💌 **Private sale invitations** — exclusive discounts not listed publicly\n" +
      "• 🚀 **Free express shipping** on every order\n" +
      "• 🎁 **Quarterly VIP gift box** — surprise curated products\n" +
      "• 📞 **Priority support** — dedicated VIP customer success line\n" +
      "• 🎂 **Birthday month** — double points + a special gift\n\n";
    if (deals.length) {
      reply += "🔥 **Current exclusive offers:**\n";
      reply += deals.map((d: any) => {
        const pct = d.discount_pct ? ` (${d.discount_pct}% off)` : '';
        return `• **${d.name}** — $${parseFloat(d.price).toFixed(2)}${pct}`;
      }).join('\n');
      reply += '\n\n';
    }
    reply += "Not a Platinum member yet? Reach 15,000 loyalty points to unlock VIP status. Want to know how?";
    return reply;
  }

  // ── Referral ──────────────────────────────────────────────────────────────
  if (intent === 'referral') {
    return (
      header +
      "👫 **Referral Program — Earn Together**\n\n" +
      "Love Vitis? Share it and get rewarded!\n\n" +
      "**How it works:**\n" +
      "1. 🔗 Get your unique referral link from **My Account → Refer a Friend**\n" +
      "2. 📤 Share it with friends via email, WhatsApp, or social media\n" +
      "3. 🎉 When they make their first purchase, you **both** get rewarded!\n\n" +
      "**Rewards:**\n" +
      "• You earn: **$10 store credit + 200 loyalty points**\n" +
      "• Your friend gets: **10% off their first order** (code applied automatically)\n" +
      "• No limit — refer as many friends as you like!\n\n" +
      "**Bonus:** Refer 5+ friends in a month → unlock a **Silver tier upgrade** instantly.\n\n" +
      "Ready to start sharing? Head to **My Account → Refer a Friend** to grab your link."
    );
  }

  // ── Reviews ───────────────────────────────────────────────────────────────
  if (intent === 'reviews') {
    return (
      header +
      "⭐ **Reviews & Ratings — Customer Success AI**\n\n" +
      "Your opinion matters — and it earns you rewards!\n\n" +
      "**How to leave a review:**\n" +
      "1. Go to **My Account → Orders**\n" +
      "2. Click **Leave a Review** next to any delivered item\n" +
      "3. Rate 1–5 stars, add a photo, and share your experience\n\n" +
      "**Why review?**\n" +
      "• ⭐ Earn **50 loyalty points** per review\n" +
      "• 📸 Photo reviews earn **an extra 25 points**\n" +
      "• 🏆 Top reviewer of the month gets a **$50 gift card**\n\n" +
      "**Reading reviews:** Every product page shows verified reviews, average ratings, and photo galleries from real customers.\n\n" +
      "Anything specific you'd like to review or read reviews about?"
    );
  }

  // ── Back in stock ─────────────────────────────────────────────────────────
  if (intent === 'back_in_stock') {
    const lowStock = await getLowStockProducts(3);
    let reply =
      header +
      "🔔 **Back-in-Stock Alerts — Sales AI**\n\n" +
      "Never miss a restock! Here's how to get notified:\n\n" +
      "1. 🔍 Visit the product page of any out-of-stock item\n" +
      "2. Click **\"Notify Me When Available\"**\n" +
      "3. We'll email you the moment it's back — usually within minutes of restocking\n\n";
    if (lowStock.length) {
      reply += "⚠️ **Selling fast — only a few left:**\n";
      reply += lowStock.map((p: any) => `• **${p.name}** — only ${p.stock_quantity} remaining at $${parseFloat(p.price).toFixed(2)}`).join('\n');
      reply += '\n\n';
    }
    reply += "Add items to your **Wishlist** and we'll also alert you if they go on sale or come back in stock.\n\nLooking for a specific item?";
    return reply;
  }

  // ── Price drop ────────────────────────────────────────────────────────────
  if (intent === 'price_drop') {
    const deals = await getDeals(5);
    let reply =
      header +
      "📉 **Price Drop Alerts — Sales AI**\n\n" +
      "Stay on top of price changes automatically:\n\n" +
      "• ❤️ **Add to Wishlist** — we'll notify you if the price drops\n" +
      "• 📬 **Subscribe to newsletters** — weekly deals delivered to your inbox\n" +
      "• 🔔 **Deal alerts** — opt in via your notification settings in **My Account**\n\n";
    if (deals.length) {
      reply += "🔥 **Prices just dropped on these items:**\n";
      reply += deals.map((d: any) => {
        const pct = d.discount_pct ? ` — **${d.discount_pct}% off**` : '';
        return `• **${d.name}** — now $${parseFloat(d.price).toFixed(2)}${pct}`;
      }).join('\n');
      reply += '\n\n';
    }
    reply += "Want me to watch a specific product for you?";
    return reply;
  }

  // ── Personalized recommendations ──────────────────────────────────────────
  if (intent === 'recommendations') {
    const [trending, bestSellers] = await Promise.all([
      getTrendingProducts(3),
      getBestSellers(3),
    ]);
    let reply =
      header +
      "⭐ **Personalized Picks — Sales & Recommendations AI**\n\n" +
      "Based on what's trending and top-rated across Vitis:\n\n";
    if (trending.length) {
      reply += "🔥 **Trending Now:**\n";
      reply += trending.map((p: any) => `• **${p.name}** — $${parseFloat(p.price).toFixed(2)}`).join('\n');
      reply += '\n\n';
    }
    if (bestSellers.length) {
      reply += "🏆 **Best Sellers:**\n";
      reply += bestSellers.map((p: any) => `• **${p.name}** — $${parseFloat(p.price).toFixed(2)} · ${p.sold_count} sold`).join('\n');
      reply += '\n\n';
    }
    reply += "💡 For truly personalized picks, **sign in** and our AI learns your style from your browsing and purchase history.\n\n";
    reply += "Tell me a category or budget and I'll narrow it down!";
    return reply;
  }

  // ── Birthday / anniversary ────────────────────────────────────────────────
  if (intent === 'birthday') {
    const deals = await getDeals(3);
    let reply =
      header +
      "🎂 **Birthday & Anniversary Rewards — Loyalty AI**\n\n" +
      "We love celebrating with our customers!\n\n" +
      "**Birthday Perks (during your birthday month):**\n" +
      "• 🎁 **500 bonus loyalty points** — added automatically\n" +
      "• 🎂 **Special birthday discount** — emailed on your birthday\n" +
      "• 👑 **Double points** on all purchases for the entire month\n" +
      "• 🎀 **Surprise gift** for Platinum members\n\n" +
      "**Anniversary Rewards (your Vitis membership anniversary):**\n" +
      "• ✨ **300 bonus points** + an exclusive anniversary discount\n" +
      "• 🥂 Thank-you email with a personalized offer\n\n" +
      "**Set your birthday:** Go to **My Account → Profile → Birthday** to register your date and never miss your perks.\n\n";
    if (deals.length) {
      reply += "🎁 **Great gift ideas right now:**\n";
      reply += deals.map((d: any) => `• **${d.name}** — $${parseFloat(d.price).toFixed(2)}`).join('\n');
      reply += '\n\n';
    }
    reply += "Looking for a birthday gift for someone? Tell me their interests and I'll find the perfect match!";
    return reply;
  }

  // ── Vendor ────────────────────────────────────────────────────────────────
  if (intent === 'vendor') {
    return (
      header +
      "🏪 **Sell on Vitis — Vendor Relations AI**\n\n" +
      "Join thousands of sellers already growing their business on Vitis Marketplace!\n\n" +
      "**Why sell on Vitis?**\n" +
      "• 🌍 Reach millions of active shoppers\n" +
      "• 📊 Powerful vendor dashboard — analytics, earnings, inventory\n" +
      "• 💸 Competitive commission rates starting at 10%\n" +
      "• 🤖 AI-powered product recommendations drive traffic to your store\n" +
      "• 📦 Integrated order & inventory management\n" +
      "• 💳 Weekly payouts to your bank account\n\n" +
      "**How to get started:**\n" +
      "1. Visit **/start-selling** and create your vendor account\n" +
      "2. Complete your store profile (name, logo, description)\n" +
      "3. List your first products\n" +
      "4. Go live — our team reviews applications within 24 hours\n\n" +
      "**Already a vendor?** Log in and head to **/vendor/dashboard** to manage your store.\n\n" +
      "Have questions about commissions or requirements? Just ask!"
    );
  }

  // ── Account ───────────────────────────────────────────────────────────────
  if (intent === 'account') {
    return (
      header +
      "👤 **Account Help — Support AI**\n\n" +
      "Here's what you can manage in **My Account**:\n\n" +
      "• 📋 **Profile** — update name, email, phone, birthday\n" +
      "• 🔑 **Password** — change your password anytime\n" +
      "• 🏠 **Addresses** — add / edit delivery addresses\n" +
      "• 📦 **Orders** — full order history and tracking\n" +
      "• ❤️ **Wishlist** — saved products\n" +
      "• 👑 **Rewards** — loyalty points and tier status\n" +
      "• 🔔 **Notifications** — control email and push preferences\n" +
      "• 🔐 **Security** — two-factor authentication\n\n" +
      "**Quick links:**\n" +
      "• Sign in → **/auth/login**\n" +
      "• Create account → **/auth/register**\n" +
      "• Forgot password → **/auth/login** → click \"Forgot password\"\n\n" +
      "Is there something specific about your account I can help with?"
    );
  }

  // ── Sustainability / brand ─────────────────────────────────────────────────
  if (intent === 'sustainability') {
    return (
      header +
      "🌿 **About Vitis — Shopping Guide AI**\n\n" +
      "Vitis is an AI-powered multi-vendor commerce platform built to connect shoppers with trusted sellers worldwide.\n\n" +
      "**Our values:**\n" +
      "• 🤝 **Trust** — verified vendors, authentic products, buyer protection\n" +
      "• ♻️ **Sustainability** — we partner with eco-conscious brands and offset shipping emissions\n" +
      "• 🤖 **Innovation** — AI-driven personalization, smart search, and autonomous support\n" +
      "• 🌍 **Inclusion** — accessible design, multi-language support, global shipping\n\n" +
      "**Our AI Team:** Behind every interaction is a team of specialized AI agents — from our Shopping Guide and Sales AI to Customer Success and Loyalty specialists — all working together to give you a seamless experience.\n\n" +
      "Anything specific you'd like to know about Vitis?"
    );
  }

  // ── Support escalation ────────────────────────────────────────────────────
  if (intent === 'support') {
    return (
      header +
      "🛟 **Support Escalation — Support AI**\n\n" +
      "I'm sorry you're running into an issue — let's get it sorted!\n\n" +
      "**Self-service options (fastest):**\n" +
      "• 📚 **Help Center** → **/help** — articles covering most common questions\n" +
      "• 📦 **Order issues** → **My Account → Orders → Report an Issue**\n" +
      "• 🔄 **Returns** → **My Account → Orders → Request Return**\n\n" +
      "**Contact our team:**\n" +
      "• 💬 **Live Chat** — click the chat icon in the footer (Mon–Fri, 9 AM–6 PM)\n" +
      "• 📧 **Email** — support@vitis.com (response within 24 hours)\n" +
      "• 📞 **Phone** — available for Gold & Platinum members in account settings\n\n" +
      "**Our support team commits to:**\n" +
      "• ⚡ First response within 2 hours (business hours)\n" +
      "• ✅ Resolution within 48 hours for standard issues\n" +
      "• 🔒 Full case tracking via your account dashboard\n\n" +
      "Can you describe the issue in more detail? I'll try to resolve it right here."
    );
  }

  // ── Default: product search ───────────────────────────────────────────────
  const keywords = extractKeywords(message);
  if (!keywords.length) {
    return (
      header +
      "I'd love to help! Could you tell me a bit more about what you're looking for?\n\n" +
      "For example:\n" +
      "• A product type or name (e.g. \"wireless headphones\")\n" +
      "• A budget (e.g. \"gifts under $50\")\n" +
      "• A category (e.g. \"electronics\", \"fashion\")\n" +
      "• An occasion (e.g. \"birthday gift for a 10-year-old\")"
    );
  }

  const products = await searchProducts(keywords, 5);
  if (!products.length) {
    const cats = await getCategories();
    const catList = cats.slice(0, 6).map((c: any) => `${c.icon || ''} ${c.name}`).join(' · ');
    return (
      header +
      `I searched for **"${keywords.join(', ')}"** but didn't find an exact match.\n\n` +
      `**We carry:** ${catList}\n\n` +
      "Try a different keyword, browse **All Products**, or let me know more about what you need and I'll suggest something great!"
    );
  }

  const lines = products.map((p: any) => formatProduct(p));
  return (
    header +
    `🔍 **Found ${products.length} result${products.length > 1 ? 's' : ''} for "${keywords.join(' ')}":**\n\n` +
    lines.join('\n\n') +
    '\n\nWant to refine by price, brand, category, or rating?'
  );
}

// ── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 });
    }
    if (message.length > 500) {
      return NextResponse.json({ success: false, error: 'Message too long (max 500 chars)' }, { status: 400 });
    }

    const reply = await buildReply(message.trim());
    return NextResponse.json({ success: true, reply });
  } catch (error: any) {
    console.error('AI chat error:', error);
    return NextResponse.json(
      { success: false, error: 'Assistant unavailable. Please try again.' },
      { status: 500 }
    );
  }
}
