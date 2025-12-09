// app/auth/error/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';

export default function AuthErrorPage() {
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