import { useEffect, useState } from "react";
import api from "./api";

export default function Dashboard() {
  const [profile, setProfile] = useState({
    company_name: "",
    industry: "",
    website: "",
    location: "",
  });

  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    fetchProfile();
    fetchCompletion();
  }, []);

  const fetchProfile = async () => {
    const res = await api.get("/company/profile");
    if (res.data.profile) {
      setProfile(res.data.profile);
    }
  };

  const fetchCompletion = async () => {
    const res = await api.get("/company/profile/completion");
    setCompletion(res.data.completion_percentage);
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    await api.post("/company/profile", profile);
    alert("Profile saved");
    fetchCompletion();
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Dashboard</h2>

      <p><b>Profile Completion:</b> {completion}%</p>

      {/* Progress Bar */}
      <div style={{ width: 300, background: "#444", marginBottom: 20 }}>
        <div
          style={{
            width: `${completion}%`,
            background: "green",
            color: "white",
            padding: 5,
          }}
        >
          {completion}%
        </div>
      </div>

      <h3>Company Profile</h3>

      <input
        name="company_name"
        placeholder="Company Name"
        value={profile.company_name}
        onChange={handleChange}
      />
      <br />

      <input
        name="industry"
        placeholder="Industry"
        value={profile.industry}
        onChange={handleChange}
      />
      <br />

      <input
        name="website"
        placeholder="Website"
        value={profile.website}
        onChange={handleChange}
      />
      <br />

      <input
        name="location"
        placeholder="Location"
        value={profile.location}
        onChange={handleChange}
      />
      <br /><br />

      <button onClick={saveProfile}>Save Profile</button>
      <br /><br />

      <button onClick={logout}>Logout</button>
    </div>
  );
}
