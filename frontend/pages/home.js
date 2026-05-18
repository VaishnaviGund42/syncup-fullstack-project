import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

export default function Home() {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeeds();

    const socket = io(SOCKET_URL);

    socket.on("newFeed", (newFeed) => {
      setFeeds((prev) => {
        const exists = prev.some((feed) => feed._id === newFeed._id);
        if (exists) return prev;
        return [newFeed, ...prev];
      });
    });

    return () => socket.disconnect();
  }, []);

  const fetchFeeds = async () => {
    try {
      const res = await axios.get(`${API_URL}/feed`);
      setFeeds(res.data);
    } catch (error) {
      console.error("Error fetching feeds:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <h2>Loading feeds...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Realtime Coaching Feed</h1>

      {feeds.length === 0 ? (
        <p>No feeds available.</p>
      ) : (
        feeds.map((feed) => (
          <div
            key={feed._id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <h3>{feed.title}</h3>
            <p>{feed.description}</p>
            <small>
              {new Date(feed.createdAt).toLocaleString()}
            </small>
          </div>
        ))
      )}
    </div>
  );
}