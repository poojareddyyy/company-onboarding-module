require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const pool = require("./db");
const authRoutes = require("./routes/auth.routes");
const companyRoutes = require("./routes/company.routes");
const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(helmet());
app.use(compression());
app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
pool.query("SELECT 1")
  .then(() => console.log("DB test query successful"))
  .catch(err => console.error("DB test failed:", err.message));
app.get("/", (req, res) => {
  res.send("Backend running successfully");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});