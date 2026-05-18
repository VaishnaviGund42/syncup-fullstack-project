import { useState } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Admin() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_URL}/feed`, {
        title,
        description,
      });

      setMessage("Feed added successfully!");
      setTitle("");
      setDescription("");
    } catch (error) {
      setMessage("Failed to add feed.");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin - Add Feed</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "300px", padding: "8px", marginBottom: "10px" }}
          />
        </div>

        <div>
          <textarea
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="4"
            style={{ width: "300px", padding: "8px", marginBottom: "10px" }}
          />
        </div>

        <button type="submit">Add Feed</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}