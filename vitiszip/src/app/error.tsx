'use client';
import { useEffect } from 'react';
import { RefreshCw, Home } from 'lucide-react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="text-center max-w-lg">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-500 mb-6">{error.message || 'An unexpected error occurred.'}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={reset} className="btn-primary gap-2"><RefreshCw className="w-4 h-4" /> Try again</button>
          <a href="/" className="btn-secondary gap-2"><Home className="w-4 h-4" /> Go home</a>
        </div>
      </div>
    </div>
  );
}
