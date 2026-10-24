'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          alignItems: 'center',
          backgroundColor: '#fff',
          color: '#171717',
          display: 'flex',
          fontFamily: 'system-ui, sans-serif',
          justifyContent: 'center',
          margin: 0,
          minHeight: '100vh',
          padding: '24px',
          textAlign: 'center',
        }}>
        <main>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>Something went wrong</h1>
          <p style={{ marginBottom: '1.5rem' }}>Please try again.</p>
          <button
            onClick={reset}
            style={{
              backgroundColor: '#171717',
              border: 0,
              borderRadius: '6px',
              color: '#fff',
              cursor: 'pointer',
              font: 'inherit',
              padding: '0.75rem 1rem',
            }}
            type="button">
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
