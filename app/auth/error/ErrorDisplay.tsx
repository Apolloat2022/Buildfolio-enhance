// app/auth/error/ErrorDisplay.tsx
'use client';

import { useSearchParams } from 'next/navigation';

export default function ErrorDisplay() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  // Your existing error display logic here
  return (
    <div>
      <h1>Authentication Error</h1>
      <p>Error: {error || 'An unknown error occurred'}</p>
      {/* ... rest of your error page UI ... */}
    </div>
  );
}