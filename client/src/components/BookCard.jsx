import React from "react";

export default function BookCard({ book, onDelete, onEdit }) {
  return (
    <article className="book-card">
      <img src={book.cover || "https://via.placeholder.com/600x360?text=No+Cover"} alt={book.title} />
      <div className="book-body">
        <h3>{book.title}</h3>
        <p className="desc">{book.desc}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
          <div className="book-price">${book.price}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="cl-btn cl-btn-outline" onClick={() => onEdit(book.id)}>Edit</button>
            <button className="cl-btn cl-btn-danger" onClick={() => onDelete(book.id)}>Delete</button>
          </div>
        </div>
      </div>
    </article>
  );
}
