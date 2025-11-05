import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

const Signup = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Registration failed");
        return;
      }
      navigate("/login");
    } catch (err) {
      setError("Server error. Try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Sign up</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input required placeholder="Username" value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
          <input required type="email" placeholder="Email" value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <input required type="password" placeholder="Password" value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          <input required type="password" placeholder="Confirm Password" value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
          <button className="auth-button" type="submit">Sign Up</button>
        </form>
        <p className="auth-link">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default Signup;