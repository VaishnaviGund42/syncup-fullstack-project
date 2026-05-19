import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>SyncUp Coaching Feed</title>
        <meta name="description" content="Realtime coaching feed with Socket.IO and Redis cache." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main style={{ padding: '40px', fontFamily: 'Arial', maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '16px' }}>SyncUp Realtime Coaching Feed</h1>
        <p style={{ marginBottom: '24px', color: '#444' }}>
          View live coaching updates on the feed page and add new posts from the admin page. Updates appear without refresh.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Link href="/home" style={{ padding: '12px 20px', borderRadius: '8px', background: '#111827', color: '#fff', textDecoration: 'none' }}>
            View Feed
          </Link>
          <Link href="/admin" style={{ padding: '12px 20px', borderRadius: '8px', background: '#2563eb', color: '#fff', textDecoration: 'none' }}>
            Admin Page
          </Link>
        </div>
      </main>
    </>
  );
}
