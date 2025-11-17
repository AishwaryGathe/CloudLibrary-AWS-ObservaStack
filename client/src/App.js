import { BrowserRouter, Routes, Route } from "react-router-dom";
import Books from "./pages/Books";
import Add from "./pages/Add";
import Update from "./pages/Update";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="cl-app">
      <BrowserRouter>
        <Header />
        <main className="cl-container cl-main">
          <Routes>
            <Route path="/" element={<Books />} />
            <Route path="/add" element={<Add />} />
            <Route path="/update/:id" element={<Update />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}
