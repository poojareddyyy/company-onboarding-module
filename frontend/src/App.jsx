import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [mode, setMode] = useState("register"); 
  // register | otp | login | company

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [otp, setOtp] = useState("");
  const [token, setToken] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  /* ================= REGISTER ================= */
  const handleRegister = async () => {
  setLoading(true);
  setError("");
  setSuccess("");

  try {
    await axios.post("http://localhost:5000/api/auth/register", {
      email,
      password,
      name: fullName,
    });

    setSuccess("OTP sent to your email");
    setMode("otp");
  } catch (err) {
    const msg = err.response?.data?.message;

    if (msg === "User already exists") {
      setError("User already exists. Please login.");
      setMode("login");
    } else {
      setError("Registration failed");
    }
  } finally {
    setLoading(false);
  }
};


  /* ================= VERIFY OTP ================= */
  const handleVerifyOtp = async () => {
  setLoading(true);
  setError("");
  setSuccess("");

  try {
    await axios.post("http://localhost:5000/api/auth/verify-otp", {
      email,
      otp,
    });

    setSuccess("Email verified successfully");
    setMode("login");
  } catch {
    setError("Invalid OTP");
  } finally {
    setLoading(false);
  }
};


  /* ================= LOGIN ================= */
  const handleLogin = async () => {
  setLoading(true);
  setError("");
  setSuccess("");

  try {
    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      { email, password }
    );

    setToken(res.data.token);
    setSuccess("Login successful");
    setMode("company");
  } catch (err) {
    setError(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};


  /* ================= COMPANY PROFILE ================= */
  const handleCompanySubmit = async () => {
  setLoading(true);
  setError("");
  setSuccess("");

  try {
    await axios.post(
      "http://localhost:5000/api/company/profile",
      {
        company_name: companyName,
        industry,
        company_size: companySize,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setSuccess("Company profile saved successfully");
  } catch {
    setError("Error saving company profile");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="app-container">
      <h1 className="app-title">Company Onboarding Module</h1>
      {loading && <div className="loader"></div>}

      {success && <p className="success-msg">{success}</p>}
      {error && <p className="error-msg">{error}</p>}

      {message && <p className="message">{message}</p>}

      {/* ================= REGISTER ================= */}
      {mode === "register" && (
        <>
          <h2 className="section-title">Register</h2>
          <div className="form-row">
            <input
              className="input-field"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="input-field"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              className="input-field"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <button
            className="primary-btn"
            onClick={handleRegister}
            disabled={loading}
            >
            {loading ? "Please wait..." : "Register"}
</button>

          </div>
        </>
      )}

      {/* ================= OTP ================= */}
      {mode === "otp" && (
        <>
          <h2 className="section-title">Verify OTP</h2>
          <div className="form-row">
            <input
              className="input-field"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
  className="primary-btn"
  onClick={handleVerifyOtp}
  disabled={loading}
>
  {loading ? "Verifying..." : "Verify OTP"}
</button>

          </div>
        </>
      )}

      {/* ================= LOGIN ================= */}
      {mode === "login" && (
        <>
          <h2 className="section-title">Login</h2>
          <div className="form-row">
            <input
              className="input-field"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="input-field"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
  className="primary-btn"
  onClick={handleLogin}
  disabled={loading}
>
  {loading ? "Please wait..." : "Login"}
</button>

          </div>
        </>
      )}

      {/* ================= COMPANY PROFILE ================= */}
      {mode === "company" && (
        <>
          <h2 className="section-title">Company Profile</h2>
          <div className="form-row">
            <input
              className="input-field"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
            <input
              className="input-field"
              placeholder="Industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
            <input
              className="input-field"
              placeholder="Company Size"
              value={companySize}
              onChange={(e) => setCompanySize(e.target.value)}
            />
            <button
  className="primary-btn"
  onClick={handleCompanySubmit}
  disabled={loading}
>
  {loading ? "Saving..." : "Submit"}
</button>

          </div>
        </>
      )}
    </div>
  );
}

export default App;
