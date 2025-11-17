import React, { useEffect, useState } from "react";
import API_BASE_URL from "../config";
import { useNavigate, useParams } from "react-router-dom";

export default function Update() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [cover, setCover] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // backend doesn't have GET /books/:id in current repo,
        // so fetch all books and find the one with id
        const res = await fetch(`${API_BASE_URL}/books`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        const b = data.find(x => String(x.id) === String(id));
        if (!b) throw new Error("Book not found");
        setBook(b);
        setTitle(b.title || "");
        setDesc(b.desc || "");
        setPrice(b.price || "");
        setCover(b.cover || "");
      } catch (e) {
        alert(e.message || "Failed to load");
        navigate("/");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, desc, price: Number(price || 0), cover })
      });
      if (!res.ok) throw new Error("Update failed");
      navigate("/");
    } catch (e) {
      alert("Update failed");
    }
  }

  if (loading) return <div className="info-box">Loading…</div>;

  return (
    <div className="form-container">
      <h2>Edit Book</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-control">
          <label>Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="form-control">
          <label>Description</label>
          <textarea rows="4" value={desc} onChange={e => setDesc(e.target.value)} />
        </div>
        <div className="form-control">
          <label>Price (USD)</label>
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} />
        </div>
        <div className="form-control">
          <label>Cover Image URL (optional)</label>
          <input value={cover} onChange={e => setCover(e.target.value)} />
        </div>

        <button className="cl-btn cl-btn-primary" type="submit">Save</button>
      </form>
    </div>
  );
}
