export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  author: { name: string; role: string; avatar: string };
  publishedAt: string;
  readTime: number;
  image: string;
  featured?: boolean;
}

export const CATEGORIES = ['All', 'Commerce', 'Vendor Tips', 'Shopping Guides', 'Platform Updates', 'Sustainability'];

export const POSTS: BlogPost[] = [
  {
    slug: 'how-to-grow-your-online-store-in-2025',
    title: "How to Grow Your Online Store in 2025: A Vendor's Complete Playbook",
    excerpt: 'From product photography to pricing psychology — the strategies top Vitis vendors use to consistently outperform their competitors and build loyal customer bases.',
    category: 'Vendor Tips',
    tags: ['selling', 'growth', 'vendors', 'strategy'],
    author: { name: 'Maya Chen', role: 'Head of Vendor Success', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&q=80' },
    publishedAt: '2025-06-18',
    readTime: 8,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=630&fit=crop&q=80',
    featured: true,
    content: `
## The Landscape Has Shifted

Running an online store in 2025 is categorically different from even two years ago. Customer expectations have risen sharply — they want fast shipping, seamless returns, and a shopping experience that feels effortless. The vendors winning on Vitis aren't necessarily those with the biggest catalogues; they're the ones who've mastered a handful of high-leverage practices.

## 1. Lead with Social Proof, Not Price

The instinct to cut prices when growth stalls is almost always wrong. Price cuts erode margin, attract one-time buyers, and position your brand as a commodity. Instead, invest the same energy in collecting and displaying reviews.

Vendors with 50+ reviews convert at a rate 3.4× higher than those with fewer than 10 — regardless of price. After every order, send a brief, warm follow-up message. Make it easy. A single link, a genuine ask. Most customers want to help if you make it frictionless.

## 2. Photography Is Your First Impression

On a marketplace, your product image is your storefront window. Blurry, poorly lit, or cluttered backgrounds signal to customers that your brand doesn't care about details — and they'll wonder what else you've cut corners on.

You don't need a studio. A clean white surface, a window facing indirect natural light, and a modern smartphone produce results that outperform average professional shoots. Shoot multiple angles: front, back, close-up of texture, and at least one lifestyle shot showing the product in use.

## 3. Write Descriptions That Sell

Product descriptions have one job: remove the doubt that prevents a purchase. Most vendors list features; the best vendors translate features into outcomes.

- **Weak:** "Stainless steel water bottle, 32oz"
- **Strong:** "Keeps drinks cold for 24 hours and hot for 12 — so your morning coffee is still warm at lunch, and your ice water survives an afternoon in a hot car."

## 4. Price Strategically, Not Desperately

Analyse your three closest competitors each month. You don't always need to be cheapest — but you need a clear reason to be priced differently. A marginally higher price with faster shipping, better photos, and more reviews will consistently outsell a lower-priced competitor.

Bundle slowly-moving stock with your bestsellers at a modest discount. It moves inventory, raises average order value, and introduces customers to products they wouldn't have found on their own.

## 5. Treat Your Storefront Like a Brand

Your Vitis store page is your brand home. Customers who navigate there directly are your highest-intent visitors. Use your store banner to communicate your unique angle in a single sentence. Pin your bestsellers to the top. Keep your "About" section personal — buyers respond to knowing there's a real person or team behind a shop.

## The Compounding Effect

None of these steps will double your revenue overnight. But vendors who commit to improving each area by 10–15% over three months typically find their overall conversion rate improving by 40–60%. Small, deliberate improvements compound faster than dramatic interventions.

Start with your worst-performing listing. Fix the photos. Rewrite the description. Ask your last five customers for a review. Then move to the next one.
    `,
  },
  {
    slug: 'the-sustainable-shopping-guide',
    title: 'The Sustainable Shopping Guide: How to Buy Better Without Spending More',
    excerpt: "Shopping sustainably doesn't require a bigger budget. Here's how to identify genuinely eco-conscious products, avoid greenwashing, and build a more thoughtful shopping habit.",
    category: 'Shopping Guides',
    tags: ['sustainability', 'eco-friendly', 'conscious shopping'],
    author: { name: 'Jordan Ellis', role: 'Sustainability Editor', avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=80&h=80&fit=crop&q=80' },
    publishedAt: '2025-06-10',
    readTime: 6,
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&h=630&fit=crop&q=80',
    content: `
## Why It Matters — and Why It's Simpler Than You Think

Sustainable shopping has a reputation for being expensive and exhausting. The reality is that most of the friction comes from information overload, not from genuine complexity. Once you know what to look for, the decisions become quick.

## Spot Genuine Claims vs. Greenwashing

The single most useful skill in sustainable shopping is distinguishing real environmental commitment from marketing language. Watch for:

**Red flags:**
- Vague terms like "eco-friendly," "natural," or "green" with no certification or explanation
- Environmental claims on the front of packaging that are contradicted by the ingredients list on the back
- A single sustainable attribute trumpeted while ignoring worse ones (e.g., "recycled packaging" on a product with a notoriously harmful supply chain)

**Good signs:**
- Specific, verifiable certifications (B Corp, Fair Trade, GOTS for textiles, FSC for wood)
- Transparency about supply chain — who makes it, where, under what conditions
- Durability guarantees or repair programmes

## Buy Less, Buy Better

The most sustainable purchase is usually the one you don't make. Before buying, ask:
1. Do I already own something that does this job?
2. Will I use this more than 30 times?
3. Is there a secondhand option?

When you do buy, prioritise longevity. A well-made item that lasts a decade has a smaller footprint than three cheaper versions replaced every few years — even if the initial cost is higher.

## Categories Where It's Easiest to Shift

**Clothing:** Look for natural fibres (organic cotton, linen, wool, Tencel) over synthetic blends. Synthetics shed microplastics with every wash. Second-hand for anything trend-driven; invest in quality for wardrobe staples.

**Electronics:** The most sustainable gadget is the one you already have. When you do upgrade, look for brands with strong repair policies and recycling programmes. Sell or donate old devices rather than binning them.

**Home goods:** Durability is everything here. Read reviews specifically for longevity. Avoid fast-home trends as you would fast fashion.

## Your Shopping Habit, Simplified

Pick one category to improve each month. Don't try to overhaul everything at once. Sustainable shopping is a practice, not a checklist — and the habit, built gradually, sticks far better than the resolution made all at once.
    `,
  },
  {
    slug: 'vitis-platform-summer-2025-update',
    title: "What's New on Vitis: Summer 2025 Platform Update",
    excerpt: "Faster checkout, smarter search, vendor analytics improvements, and more — here's everything that shipped in the last quarter and what's coming next.",
    category: 'Platform Updates',
    tags: ['product', 'updates', 'features'],
    author: { name: 'Alex Patel', role: 'Product Lead', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&q=80' },
    publishedAt: '2025-06-01',
    readTime: 4,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop&q=80',
    content: `
## A Faster, Smarter Platform

Every quarter we ship improvements driven by feedback from vendors, customers, and our internal data. Here's what landed in Summer 2025.

## Checkout

We rebuilt checkout from the ground up. The result is a 40% reduction in the average time from cart to order confirmation. Key changes:
- **One-page checkout** — shipping, payment, and confirmation on a single screen
- **Address autocomplete** — powered by postal data, reducing typos and failed deliveries
- **Saved payment methods** — securely stored for returning customers

## Search

Search now ranks results using a combination of textual relevance, seller rating, in-stock status, and recent purchase signals. In testing, relevant results appeared in the top 5 positions 78% of the time, up from 61%.

## Vendor Analytics

The vendor dashboard now includes:
- **Traffic sources** — see exactly which channels drive your store visits
- **Conversion funnel** — where customers drop off between product view and purchase
- **Cohort retention** — how often customers return after their first order

## What's Coming

**Q3 2025 (in progress):**
- Bundle pricing tools — set discount rules for multi-item purchases
- Bulk order management — process and fulfil high-volume orders faster
- Customer Q&A on product pages — let buyers ask questions publicly

We build Vitis in close partnership with the people who use it. If you have a feature request or a pain point we haven't addressed, the feedback button in your dashboard goes directly to the product team — and we read every submission.
    `,
  },
  {
    slug: 'pricing-psychology-for-online-sellers',
    title: "Pricing Psychology: Why Customers Buy (or Don't) Based on How You Present Your Prices",
    excerpt: 'The price itself is only part of the equation. How you display, frame, and contextualise a price can be the difference between a sale and a bounce.',
    category: 'Vendor Tips',
    tags: ['pricing', 'psychology', 'conversion', 'selling'],
    author: { name: 'Maya Chen', role: 'Head of Vendor Success', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&q=80' },
    publishedAt: '2025-05-22',
    readTime: 7,
    image: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=1200&h=630&fit=crop&q=80',
    content: `
## Price Is a Signal, Not Just a Number

Customers don't experience your price in a vacuum. They interpret it relative to anchors, expectations, and the way it's presented. Understanding this isn't about manipulation — it's about removing friction from a decision your customer is already trying to make.

## The Anchor Effect

The first price a customer sees sets their reference point for everything that follows. This is why "was / now" pricing works: the original price anchors the customer's perception, making the current price feel like a deal.

Use this honestly. If you're running a genuine promotion, make the original price prominent. If you're not, don't fabricate one — customers have excellent instincts for fake discounts, and the trust damage isn't worth it.

## Charm Pricing and Its Limits

Prices ending in 9 ($29, $99, $199) consistently outperform round numbers in studies, because the brain encodes the left-most digit most strongly. $29 feels closer to $20 than to $30.

However, charm pricing signals "value" positioning. For premium products, round numbers ($30, $100, $200) can actually increase perceived quality and willingness to pay. Match your pricing format to your positioning.

## Bundle to Raise Average Order Value

Bundling reframes the customer's decision from "should I buy this?" to "which bundle is right for me?" — and shifts the loss aversion from buying to choosing.

Offer three tiers: a basic bundle, a recommended bundle (your margin sweet spot, clearly marked as "most popular"), and a premium bundle. Most buyers choose the middle option. Make sure your middle option is the one you most want to sell.

## Shipping Cost Psychology

"Free shipping" outperforms "shipping included in price" even when the math is identical. Customers feel the shipping cost as a loss more acutely than they feel the product price. If your economics allow it, build shipping into your product price and label it free.

If free shipping isn't viable, set a threshold just above your current average order value. "Free shipping on orders over $X" nudges customers to add one more item — and your average order value rises to meet the threshold.

## The Practical Takeaway

Pick one of these principles and apply it to your three lowest-converting products this week. Measure the result over two weeks before changing anything else. Pricing experiments work best when they're isolated enough to attribute causality.
    `,
  },
  {
    slug: 'how-to-write-product-reviews-that-help',
    title: 'How to Write a Product Review That Actually Helps Other Shoppers',
    excerpt: "A useful review answers the questions the product listing doesn't. Here's the simple framework that makes your feedback 10× more valuable.",
    category: 'Shopping Guides',
    tags: ['reviews', 'shopping', 'community'],
    author: { name: 'Sam Rivera', role: 'Community Manager', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&q=80' },
    publishedAt: '2025-05-15',
    readTime: 4,
    image: 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=80&h=80&fit=crop&crop=faces&q=80',
    content: `
## Why Reviews Matter More Than You Think

Before a customer buys something online, they can't touch it, try it, or assess its quality in person. A review from someone who has the product is their closest proxy to that physical experience. A well-written review doesn't just help the next buyer — it helps vendors understand what's working and what isn't.

## The Framework: Answer the Question Behind the Question

Every review should address the core anxiety the next buyer has — usually one of:
- "Will this actually fit / work for my specific situation?"
- "Is the quality as good as it looks in the photos?"
- "Was the vendor reliable?"

Structure your review around those questions, even if the listing doesn't ask them explicitly.

## What to Include

**Context first:** Briefly describe who you are relative to this product. "I've been cycling 200 miles a week for three years" means something different from "I bought this as a gift for my son." Context helps future buyers know how much to weight your opinion.

**Specifics over adjectives:** "The stitching came loose after six washes" is infinitely more useful than "poor quality." "Fits true to size for a 5'10", 175lb frame" is more useful than "runs small."

**What you'd want to know:** Before you bought, what question did you have that the listing didn't answer? Answer that question in your review.

**Honest tone:** The most trusted reviews acknowledge both positives and limitations. A review that says nothing negative reads as either fake or as the reviewer not paying attention.

## What to Skip

- One-liners that restate the product name
- Complaints about shipping speed without context (carriers vary)
- Emotional language without evidence ("absolute garbage," "best thing ever")
- Irrelevant personal details

## Length

Three to six sentences is usually enough. Don't aim for long; aim for specific. The reader will thank you for their time.
    `,
  },
  {
    slug: 'inside-the-vitis-fulfilment-network',
    title: 'Inside the Vitis Fulfilment Network: How Your Order Gets From Seller to Door',
    excerpt: "Ever wondered what actually happens after you hit \"Place Order\"? We trace the journey from warehouse shelf to doorstep — and share what we're doing to make it faster.",
    category: 'Commerce',
    tags: ['logistics', 'shipping', 'fulfilment', 'operations'],
    author: { name: 'Alex Patel', role: 'Product Lead', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&q=80' },
    publishedAt: '2025-05-05',
    readTime: 5,
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=630&fit=crop&q=80',
    content: `
## The Journey Begins the Moment You Click

Most customers never think about what happens between "Place Order" and the knock on the door. For the Vitis team, that gap represents thousands of decisions, handoffs, and quality checks every day. Here's how it works.

## Step 1: Order Confirmation and Routing

Within seconds of your order being placed, our system:
1. Confirms payment has cleared
2. Routes the order to the optimal fulfilment location (vendor warehouse, third-party logistics partner, or Vitis-managed facility)
3. Notifies the seller and generates a pick list

For products fulfilled by Vitis, a pick-and-pack worker locates your item within minutes. For vendor-fulfilled orders, the seller receives an alert in their dashboard and is expected to ship within their stated handling time.

## Step 2: Pack and Dispatch

Packing standards vary by vendor, but all Vitis-managed fulfilments follow strict guidelines:
- Products verified against order details before packing
- Fragile items flagged for appropriate void fill
- Shipping label generated automatically, linked to your tracking ID

## Step 3: Carrier Handoff

Once packed, your order enters the carrier network. We work with regional and national carriers, dynamically routing each shipment based on destination, weight, and speed requirements to balance cost against your delivery window.

## Step 4: Last Mile

The "last mile" — your local delivery driver — is the part of the chain we have least control over and that matters most to you. We surface real-time tracking events in your account so you always know where your package is.

## What We're Improving

- **Smart routing v2** — launching Q3, will cut average transit time by 0.8 days
- **Vendor pick-time accountability** — sellers who consistently under-perform their stated handling time will be flagged in search rankings
- **Packaging reduction programme** — working with high-volume vendors to reduce void fill waste by 30%

Questions? Your order status page has a direct line to our support team — no bots, real people, fast responses.
    `,
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function getRelatedPosts(post: BlogPost, count = 3): BlogPost[] {
  return POSTS.filter((p) => p.slug !== post.slug && (p.category === post.category || p.tags.some((t) => post.tags.includes(t)))).slice(0, count);
}

export const CATEGORY_COLORS: Record<string, string> = {
  Commerce:           'bg-blue-100 text-blue-700',
  'Vendor Tips':      'bg-purple-100 text-purple-700',
  'Shopping Guides':  'bg-green-100 text-green-700',
  'Platform Updates': 'bg-orange-100 text-orange-700',
  Sustainability:     'bg-teal-100 text-teal-700',
};

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}
