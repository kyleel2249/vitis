import Link from 'next/link';

export default function NewsletterUnsubscribedPage() {
  return (
    <div className="min-h-[55vh] flex items-center justify-center px-4">
      <div className="max-w-lg text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center text-3xl">✓</div>
        <h1 className="text-3xl font-bold text-gray-900 mt-6">You’re unsubscribed</h1>
        <p className="text-gray-500 mt-3">
          You will no longer receive Vitis newsletter emails. You can subscribe again anytime from the footer.
        </p>
        <Link href="/" className="btn-primary mt-8">Back to shopping</Link>
      </div>
    </div>
  );
}