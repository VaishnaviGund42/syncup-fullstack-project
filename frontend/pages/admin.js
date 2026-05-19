import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Admin() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.post(`${API_URL}/feed`, {
        title,
        description,
      });

      setMessage('Feed added successfully!');
      setTitle('');
      setDescription('');
    } catch (error) {
      setMessage('Failed to add feed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <nav style={{ marginBottom: '20px', display: 'flex', gap: '16px' }}>
        <Link href="/">Home</Link>
        <Link href="/home">Feed</Link>
      </nav>

      <h1>Admin - Add Feed</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: '520px' }}>
        <div style={{ marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <textarea
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="5"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            background: '#111827',
            color: '#fff',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Saving...' : 'Add Feed'}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: '16px', color: message.includes('Failed') ? '#b91c1c' : '#166534' }}>
          {message}
        </p>
      )}
    </div>
  );
}
