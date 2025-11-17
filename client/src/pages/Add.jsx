import React, { useState } from "react";
import API_BASE_URL from "../config";
import { useNavigate } from "react-router-dom";

export default function Add() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [cover, setCover] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title) return alert("Title required");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/books`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, desc, price: Number(price || 0), cover })
      });
      if (!res.ok) throw new Error("Failed");
      navigate("/");
    } catch (e) {
      alert("Create failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-container">
      <h2>Add Book</h2>
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

        <button className="cl-btn cl-btn-primary" type="submit" disabled={loading}>
          {loading ? "Saving…" : "Create Book"}
        </button>
      </form>
    </div>
  );
}
