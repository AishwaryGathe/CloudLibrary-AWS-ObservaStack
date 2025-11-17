import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="cl-header">
      <div className="cl-container cl-header-inner">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <div className="cl-logo">Cloud Library</div>
          </Link>
          <div style={{ color: "#64748b", fontSize: 14 }}>A lightweight cloud book catalog</div>
        </div>

        <nav className="cl-nav">
          <Link to="/" className="cl-link">Home</Link>
          <Link to="/add" className="cl-link">Add Book</Link>
        </nav>
      </div>
    </header>
  );
}
