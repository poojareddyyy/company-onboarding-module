import { useState } from "react";
import axios from "axios";
function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setName] = useState("");
  const [token, setToken] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const register = async () => {
  try {
    await axios.post("http://localhost:5000/api/auth/register", {
      email,
      password,
      full_name: fullName
    });
    alert("Registration successful. Please login.");
  } catch (err) {
    alert("Registration failed");
  }
};
  const login = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );
      setToken(res.data.token);
      alert("Login successful");
    } catch (err) {
      alert("Login failed");
    }
  }; 
  const submitCompany = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/company/profile",
        {
          company_name: companyName,
          industry,
          company_size: companySize
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert("Company profile saved successfully");
    } catch (err) {
      alert("Error saving company profile");
    }
  };
  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Company Onboarding Module</h1>
      {!token ? (
        <>          
          <h2>Register</h2>
          <input placeholder="Email" onChange={e => setEmail(e.target.value)} /><br /><br />
          <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} /><br /><br />
          <input placeholder="Full Name" onChange={e => setName(e.target.value)} /><br /><br />
          <button onClick={register}>Register</button>
          <hr style={{ margin: "30px 0" }} />
          <h2>Login</h2>
          <input placeholder="Email" onChange={e => setEmail(e.target.value)} /><br /><br />
          <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} /><br /><br />
          <button onClick={login}>Login</button>
        </>
      ) : (
        <>          
          <h2>Company Profile</h2>
          <input placeholder="Company Name" onChange={e => setCompanyName(e.target.value)} /><br /><br />
          <input placeholder="Industry" onChange={e => setIndustry(e.target.value)} /><br /><br />
          <input placeholder="Company Size" onChange={e => setCompanySize(e.target.value)} /><br /><br />
          <button onClick={submitCompany}>Submit</button>
        </>
      )}
    </div>
  );
}
export default App;
