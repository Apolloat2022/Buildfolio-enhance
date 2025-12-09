// app/auth/error/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// Wrap the main content in a separate component
function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-red-600">Auth Error</h1>
      <p className="mt-4">Error code: {error}</p>
      <p className="mt-2">
        {error === 'Configuration' 
          ? 'Check your .env file and GitHub OAuth settings'
          : 'Unknown authentication error'}
      </p>
    </div>
  );
}

// Main page component with Suspense boundary
export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading error details...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}