const { Pool } = require("pg");

console.log("Loading DB module...");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test the database connection
pool.query("SELECT 1")
  .then(() => console.log("PostgreSQL connected successfully"))
  .catch((err) => {
    console.error("PostgreSQL connection failed");
    console.error(err.message);
  });

module.exports = pool;
