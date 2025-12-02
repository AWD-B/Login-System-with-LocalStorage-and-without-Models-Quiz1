import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

// Import icons
import { 
  FaUser, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaPaw, 
  FaHeart,
  FaShieldAlt 
} from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({ 
    username: "", 
    password: "" 
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store data (your original authentication logic)
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userData", JSON.stringify(data.user));
      
      // Navigate to dashboard
      navigate("/dashing");
      
    } catch (err) {
      setError(err.message || "Server error");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      {/* Visual Section with Beautiful Background */}
      <div className="login-visual-section">
        <div className="login-image-overlay"></div>
        <div 
          className="login-background-image"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80')`
          }}
        ></div>
        
        {/* Welcome Content Overlay */}
        <div className="welcome-content">
          <div className="welcome-logo">
            <FaPaw className="logo-icon" />
            <h1>Pawfect Care</h1>
          </div>
          <div className="welcome-text">
            <h2>Where Every Tail Wags with Joy</h2>
            <p>Join thousands of pet parents who trust us with their furry family members</p>
          </div>
          <div className="trust-badges">
            <div className="trust-badge">
              <FaShieldAlt className="badge-icon" />
              <span>Secure & Trusted</span>
            </div>
            <div className="trust-badge">
              <FaHeart className="badge-icon" />
              <span>Veterinarian Approved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="login-form-section">
        <div className="login-form-container">
          
          {/* Form Header */}
          <div className="form-header">
            <div className="header-icon">
              <FaPaw />
            </div>
            <h2>Welcome Back!</h2>
            <p className="subtitle">We missed you and your furry friend! 🐾</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message slide-in">
              <div className="error-icon">!</div>
              <div className="error-text">{error}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label">Username or Email</label>
              <div className="input-container">
                <FaUser      className="input-icon" />
                <input 
                  type="text" 
                  name="username"
                  placeholder="Enter your username or email"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required
                  disabled={isLoading}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-container">
                <FaLock className="input-icon" />
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  disabled={isLoading}
                  className="form-input"
                />
                <button 
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Remember me
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className={`login-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="button-spinner"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <FaPaw className="button-icon" />
                  Sign In to Your Account
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span>New to Pawfect Care?</span>
          </div>

          {/* Sign Up Link */}
          <div className="signup-section">
            <p>Don't have an account yet?</p>
            <Link to="/signup" className="signup-button">
              Create Your Account
            </Link>
          </div>

          {/* Security Notice */}
          <div className="security-notice">
            <FaShieldAlt className="security-icon" />
            <span>Your data is securely encrypted and protected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;