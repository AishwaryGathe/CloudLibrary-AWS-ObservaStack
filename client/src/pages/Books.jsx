import React, { useEffect, useState } from "react";
import API_BASE_URL from "../config";
import BookCard from "../components/BookCard";
import { useNavigate } from "react-router-dom";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  async function fetchBooks() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`${API_BASE_URL}/books`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      setBooks(data);
    } catch (e) {
      setErr(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBooks();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this book?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/books/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      await fetchBooks();
    } catch (e) {
      alert("Delete failed");
    }
  }

  function handleEdit(id) {
    navigate(`/update/${id}`);
  }

  return (
    <section className="books-list">
      <div className="hero">
        <h2>Discover. Read. Learn.</h2>
        <p className="sub">Cloud Library — catalog backed by a secure cloud API.</p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18 }}>
        <h2>Books</h2>
        <div>
          <button className="cl-btn cl-btn-primary" onClick={() => navigate("/add")}>Add Book</button>
        </div>
      </div>

      {loading && <div className="info-box" style={{ marginTop: 12 }}>Loading books…</div>}
      {err && <div className="error-box" style={{ marginTop: 12 }}>{err}</div>}

      {!loading && !err && (
        <div className="books-grid" style={{ marginTop: 16 }}>
          {books.map(b => (
            <BookCard key={b.id} book={b} onDelete={handleDelete} onEdit={handleEdit} />
          ))}
        </div>
      )}
    </section>
  );
}
