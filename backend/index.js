import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(morgan("common"));

// ===============================
// DATABASE POOL (CORRECT SETTINGS)
// ===============================
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: "test",
  port: 3306,                 // FIXED: RDS port should not come from env.PORT
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test DB connection at startup
async function testConnection() {
  try {
    const [rows] = await db.query("SELECT 1");
    console.log("Database connected successfully.");
  } catch (err) {
    console.error("DB connection failed:", err);
  }
}
testConnection();

// ===============================
// HEALTH CHECK FOR LOAD BALANCER
// ===============================
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// ===============================
// ROUTES
// ===============================
app.get("/", (req, res) => {
  res.json("Backend is running");
});

app.get("/books", async (req, res) => {
  try {
    const [data] = await db.query("SELECT * FROM books");
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.json(err);
  }
});

app.post("/books", async (req, res) => {
  const q = "INSERT INTO books(`title`, `desc`, `price`, `cover`) VALUES (?)";
  const values = [req.body.title, req.body.desc, req.body.price, req.body.cover];

  try {
    const [data] = await db.query(q, [values]);
    return res.json(data);
  } catch (err) {
    return res.send(err);
  }
});

app.delete("/books/:id", async (req, res) => {
  const q = "DELETE FROM books WHERE id = ?";
  try {
    const [data] = await db.query(q, [req.params.id]);
    return res.json(data);
  } catch (err) {
    return res.send(err);
  }
});

app.put("/books/:id", async (req, res) => {
  const q =
    "UPDATE books SET `title`=?, `desc`=?, `price`=?, `cover`=? WHERE id = ?";

  const values = [
    req.body.title,
    req.body.desc,
    req.body.price,
    req.body.cover,
  ];

  try {
    const [data] = await db.query(q, [...values, req.params.id]);
    return res.json(data);
  } catch (err) {
    return res.send(err);
  }
});

// ===============================
// START SERVER ON 0.0.0.0
// ===============================
const APP_PORT = process.env.APP_PORT || 3001;

app.listen(APP_PORT, "0.0.0.0", () => {
  console.log(`Backend running on port ${APP_PORT}`);
});
