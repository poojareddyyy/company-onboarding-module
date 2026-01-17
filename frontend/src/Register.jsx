import { useState } from "react";
import api from "./api";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    gender: "",
    mobile_no: "",
  });

  const handleRegister = async () => {
  try {
    await api.post("/auth/register", {
      email,
      password,
      full_name,
      gender,
      mobile_no,
    });

    alert("Registration successful! Please login.");
  } catch (err) {
    console.error("Register error:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Error registering user");
  }
};

  return (
    <div style={{ padding: 30 }}>
      <h2>Register</h2>

      <input name="email" placeholder="Email" onChange={handleChange} />
      <br />

      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
      />
      <br />

      <input
        name="full_name"
        placeholder="Full Name"
        onChange={handleChange}
      />
      <br />

      <input
        name="gender"
        placeholder="Gender (m/f)"
        onChange={handleChange}
      />
      <br />

      <input
        name="mobile_no"
        placeholder="Mobile Number"
        onChange={handleChange}
      />
      <br />

      <button onClick={submit}>Register</button>
    </div>
  );
}
