const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const { sendOtpEmail } = require("../utils/email");

/* ================= REGISTER ================= */
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await pool.query(
      `INSERT INTO users (email, password, full_name, otp, is_verified)
       VALUES ($1, $2, $3, $4, false)`,
      [email, hashedPassword, name, otp]
    );

    // Send OTP email
    await sendOtpEmail(email, otp);

    res.status(201).json({
      success: true,
      message: "Registration successful. OTP sent to email.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
};

/* ================= VERIFY OTP ================= */
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const result = await pool.query(
      "SELECT id, otp FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    if (result.rows[0].otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await pool.query(
      "UPDATE users SET is_verified=true, otp=NULL WHERE email=$1",
      [email]
    );

    res.json({ success: true, message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "OTP verification failed" });
  }
};


/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];
    
    if (!user.is_verified) {
      return res.status(403).json({ message: "Please verify your email first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "90d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.full_name,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};
