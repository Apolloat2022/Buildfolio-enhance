// app/diagnostic/page.tsx
export default function DiagnosticPage() {
  const tests = [
    { name: 'Auth Providers', url: '/api/auth/providers' },
    { name: 'Direct GitHub Sign-in', url: '/api/auth/signin/github' },
    { name: 'Session Check', url: '/api/auth/session' },
    { name: 'Homepage', url: '/' },
  ]

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '30px' }}>Auth Diagnostic</h1>
      
      <div style={{ display: 'grid', gap: '15px', marginBottom: '40px' }}>
        {tests.map((test) => (
          <a
            key={test.name}
            href={test.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              backgroundColor: '#0070f3',
              color: 'white',
              padding: '15px',
              borderRadius: '8px',
              textDecoration: 'none',
              textAlign: 'center',
              fontSize: '16px',
            }}
          >
            {test.name}
          </a>
        ))}
      </div>
      
      <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>Expected Results:</h2>
        <ul style={{ lineHeight: '1.8' }}>
          <li><strong>Auth Providers:</strong> Should show GitHub JSON config</li>
          <li><strong>Direct GitHub Sign-in:</strong> Should IMMEDIATELY redirect to GitHub.com</li>
          <li><strong>Session Check:</strong> Should show empty session (not signed in)</li>
        </ul>
      </div>
    </div>
  )
}