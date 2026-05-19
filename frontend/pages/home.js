import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { io } from 'socket.io-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

export default function Home() {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [socketStatus, setSocketStatus] = useState('connecting');

  useEffect(() => {
    fetchFeeds();

    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      setSocketStatus('connected');
      console.log('Socket connected');
    });

    socket.on('disconnect', (reason) => {
      setSocketStatus('disconnected');
      console.log('Socket disconnected', reason);
    });

    socket.on('connect_error', (err) => {
      setSocketStatus('error');
      setError('Realtime connection failed.');
      console.error('Socket connect error:', err);
    });

    socket.on('newFeed', (newFeed) => {
      setFeeds((prev) => {
        const exists = prev.some((feed) => feed._id === newFeed._id);
        if (exists) return prev;
        return [newFeed, ...prev];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchFeeds = async () => {
    try {
      const res = await axios.get(`${API_URL}/feed`);
      setFeeds(res.data);
    } catch (err) {
      setError('Failed to fetch feeds. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <h2 style={{ padding: 20 }}>Loading feeds...</h2>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <nav style={{ marginBottom: '20px', display: 'flex', gap: '16px' }}>
        <Link href="/">Home</Link>
        <Link href="/admin">Admin</Link>
      </nav>

      <h1>Realtime Coaching Feed</h1>
      <p style={{ color: '#333', marginBottom: '16px' }}>
        Socket status: <strong>{socketStatus}</strong>
      </p>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {feeds.length === 0 ? (
        <p>No feeds yet. Add one from the admin page.</p>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {feeds.map((feed) => (
            <article
              key={feed._id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '10px',
                padding: '18px',
                background: '#fff',
                boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              }}
            >
              <h2 style={{ margin: '0 0 8px' }}>{feed.title}</h2>
              <p style={{ margin: '0 0 12px', color: '#555' }}>{feed.description}</p>
              <small style={{ color: '#777' }}>
                {new Date(feed.createdAt).toLocaleString()}
              </small>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
