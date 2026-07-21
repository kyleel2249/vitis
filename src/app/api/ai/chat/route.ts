import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// ── Intent detection ────────────────────────────────────────────────────────

type Intent =
  | 'search_products'
  | 'deals'
  | 'categories'
  | 'order_help'
  | 'greeting'
  | 'fallback';

function detectIntent(message: string): Intent {
  const m = message.toLowerCase();
  if (/\b(hi|hello|hey|howdy|what can you do|help)\b/.test(m)) return 'greeting';
  if (/\b(deals?|sales?|offers?|discounts?|promo|flash|coupon|cheap)\b/.test(m)) return 'deals';
  if (/\b(categor(y|ies)?|department|section|browse|types of)\b/.test(m)) return 'categories';
  if (/\b(orders?|track|shipping|deliver|returns?|refund|cancel)\b/.test(m)) return 'order_help';
  return 'search_products';
}

// ── Database helpers ────────────────────────────────────────────────────────

async function searchProducts(keywords: string[], limit = 5) {
  if (!keywords.length) return [];
  const pattern = `%${keywords.join('%')}%`;
  const altPattern = keywords.map((k) => `%${k}%`);
  const conditions = altPattern.map((_, i) => `(p.name ILIKE $${i + 1} OR p.description ILIKE $${i + 1} OR p.tags::text ILIKE $${i + 1})`).join(' OR ');
  const rows = await query(
    `SELECT p.name, p.slug, p.price, p.compare_price, p.images, p.stock_quantity,
            v.store_name as vendor_name
     FROM products p
     LEFT JOIN vendors v ON v.id = p.vendor_id
     WHERE p.is_active = true AND (${conditions})
     ORDER BY p.is_featured DESC, p.sold_count DESC
     LIMIT $${altPattern.length + 1}`,
    [...altPattern, limit]
  );
  return rows;
}

async function getDeals(limit = 5) {
  const rows = await query(
    `SELECT p.name, p.slug, p.price, p.compare_price, p.images,
            ROUND(((p.compare_price - p.price) / p.compare_price) * 100) as discount_pct
     FROM products p
     WHERE p.is_active = true AND p.compare_price > p.price
     ORDER BY discount_pct DESC
     LIMIT $1`,
    [limit]
  );
  return rows;
}

async function getCategories() {
  const rows = await query(
    `SELECT c.name, c.slug, COUNT(p.id)::int as product_count
     FROM categories c
     LEFT JOIN products p ON p.category_id = c.id AND p.is_active = true
     WHERE c.is_active = true
     GROUP BY c.id, c.name, c.slug
     ORDER BY product_count DESC
     LIMIT 8`,
    []
  );
  return rows;
}

// ── Extract search keywords from user message ───────────────────────────────

function extractKeywords(message: string): string[] {
  const stopwords = new Set([
    'find', 'show', 'get', 'give', 'me', 'a', 'an', 'the', 'i', 'want',
    'need', 'looking', 'for', 'some', 'any', 'good', 'best', 'great',
    'please', 'can', 'you', 'under', 'over', 'about', 'like', 'what',
    'are', 'is', 'have', 'has', 'do', 'does',
  ]);
  return message
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopwords.has(w));
}

// ── Format product list for display ────────────────────────────────────────

function formatProduct(p: any): string {
  const image = Array.isArray(p.images) ? p.images[0] : (typeof p.images === 'string' ? JSON.parse(p.images || '[]')[0] : null);
  const price = `$${parseFloat(p.price).toFixed(2)}`;
  const originalPrice = p.compare_price ? ` ~~$${parseFloat(p.compare_price).toFixed(2)}~~` : '';
  const stock = p.stock_quantity > 0 ? '✅ In stock' : '⚠️ Out of stock';
  const vendor = p.vendor_name ? ` · ${p.vendor_name}` : '';
  return `**${p.name}** — ${price}${originalPrice}\n${stock}${vendor}`;
}

// ── Build response ──────────────────────────────────────────────────────────

async function buildReply(message: string): Promise<string> {
  const intent = detectIntent(message);

  if (intent === 'greeting') {
    return (
      "Hi there! 👋 I'm **Vitis Assistant**, your personal shopping guide.\n\n" +
      "I can help you:\n" +
      "• 🔍 Find products by name, type, or budget\n" +
      "• 💰 Spot today's best deals & discounts\n" +
      "• 📦 Browse categories\n" +
      "• 📬 Get help with orders & returns\n\n" +
      "What are you looking for today?"
    );
  }

  if (intent === 'deals') {
    const deals = await getDeals(5);
    if (!deals.length) {
      return "No discounted products right now — but new deals drop frequently. Check back soon! 🔥";
    }
    const lines = deals.map((d: any) => {
      const pct = d.discount_pct ? ` (${d.discount_pct}% off)` : '';
      return `• **${d.name}** — $${parseFloat(d.price).toFixed(2)}${pct}`;
    });
    return `🔥 **Today's top deals:**\n\n${lines.join('\n')}\n\nWant details on any of these?`;
  }

  if (intent === 'categories') {
    const cats = await getCategories();
    if (!cats.length) {
      return "I couldn't load categories right now. Try browsing the **Products** page to see everything we carry!";
    }
    const lines = cats.map((c: any) => `• **${c.name}** (${c.product_count} items)`);
    return `🗂️ **Shop by category:**\n\n${lines.join('\n')}\n\nTell me a category and I'll find you the best items!`;
  }

  if (intent === 'order_help') {
    return (
      "For order-related help, here's what I can tell you:\n\n" +
      "📦 **Track an order** — go to **My Account → Orders**\n" +
      "🔄 **Returns** — items can be returned within 30 days of delivery\n" +
      "🚚 **Shipping** — standard 3-5 days, express 1-2 days\n" +
      "❌ **Cancel** — orders can be cancelled before they ship from **My Account**\n\n" +
      "Need something more specific? Contact support via the footer links."
    );
  }

  // Default: search products from the database
  const keywords = extractKeywords(message);
  if (!keywords.length) {
    return (
      "I'd love to help! Could you tell me a bit more about what you're looking for? " +
      "For example: a product type, brand, price range, or category."
    );
  }

  const products = await searchProducts(keywords, 5);
  if (!products.length) {
    const cats = await getCategories();
    const catList = cats.slice(0, 5).map((c: any) => c.name).join(', ');
    return (
      `I searched for "${keywords.join(', ')}" but didn't find an exact match.\n\n` +
      `We carry: ${catList}, and more.\n\n` +
      "Try a different term, or visit **Products** to browse everything!"
    );
  }

  const lines = products.map(formatProduct);
  return (
    `🔍 **Found ${products.length} result${products.length > 1 ? 's' : ''} for "${keywords.join(' ')}":**\n\n` +
    lines.join('\n\n') +
    '\n\nWant to refine by price, brand, or category?'
  );
}

// ── Route handler ───────────────────────────────────────────────────────────

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
