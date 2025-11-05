import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashing.css";

const Dashing = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashing">
      <h1>Welcome, {user.username || user.name || user.email}!</h1>
      <p>Email: {user.email}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashing;
