import { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

export default function Home() {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeeds();

    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Socket connected');
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
      setError('Failed to fetch feeds');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <h2 style={{ padding: 20 }}>Loading feeds...</h2>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Realtime Coaching Feed</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}

}