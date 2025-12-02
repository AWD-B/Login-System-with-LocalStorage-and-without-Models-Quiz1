import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

// Import icons (install: npm install react-icons)
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaCheck, 
  FaTimes, 
  FaPaw,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaHeart
} from "react-icons/fa";

const Signup = () => {
  // DOM State Management
  const [formData, setFormData] = useState({ 
    username: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  
  // UI State Management
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Validation State
  const [validation, setValidation] = useState({
    username: { isValid: false, isChecking: false, message: "" },
    email: { isValid: false, isChecking: false, message: "" },
    password: { isValid: false, message: "" },
    confirmPassword: { isValid: false, message: "" }
  });

  // Password Strength Calculation
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const navigate = useNavigate();

  // DOM Effect: Real-time password strength calculation
  useEffect(() => {
    calculatePasswordStrength(formData.password);
  }, [formData.password]);

  // DOM Effect: Real-time confirm password validation
  useEffect(() => {
    validateConfirmPassword();
  }, [formData.password, formData.confirmPassword]);

  // DOM Handler: Password strength algorithm
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    
    setPasswordStrength(Math.min(strength, 100));
    
    // Update password validation state
    setValidation(prev => ({
      ...prev,
      password: {
        isValid: strength >= 70,
        message: getPasswordMessage(strength)
      }
    }));
  };

  // DOM Helper: Password strength messages
  const getPasswordMessage = (strength) => {
    if (strength === 0) return "Enter a password";
    if (strength < 40) return "Weak password";
    if (strength < 70) return "Moderate password";
    if (strength < 90) return "Strong password";
    return "Very strong password";
  };

  // DOM Handler: Confirm password validation
  const validateConfirmPassword = () => {
    const isValid = formData.confirmPassword === formData.password && formData.confirmPassword.length > 0;
    setValidation(prev => ({
      ...prev,
      confirmPassword: {
        isValid,
        message: isValid ? "Passwords match" : "Passwords do not match"
      }
    }));
  };

  // API Handler: Real-time username availability check (debounced)
  useEffect(() => {
    const checkUsernameAvailability = async () => {
      if (formData.username.length < 3) {
        setValidation(prev => ({
          ...prev,
          username: { 
            isValid: false, 
            isChecking: false, 
            message: "Username must be at least 3 characters" 
          }
        }));
        return;
      }

      setValidation(prev => ({
        ...prev,
        username: { ...prev.username, isChecking: true }
      }));

      try {
        // FIXED: Correct API URL - added /auth path
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const res = await fetch(`http://localhost:5000/api/auth/check-username?username=${encodeURIComponent(formData.username)}`, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        clearTimeout(timeoutId);

        if (!res.ok) {
          // If endpoint doesn't exist (404) or other server error
          if (res.status === 404) {
            throw new Error('Username check service unavailable');
          }
          throw new Error(`Server error: ${res.status}`);
        }

        const data = await res.json();
        
        setValidation(prev => ({
          ...prev,
          username: {
            isValid: data.available,
            isChecking: false,
            message: data.message || (data.available ? "Username available" : "Username already taken")
          }
        }));
        
      } catch (err) {
        console.error('Username check failed:', err);
        
        // User-friendly error messages based on error type
        let errorMessage = "Unable to check username";
        
        if (err.name === 'AbortError') {
          errorMessage = "Username check timed out";
        } else if (err.message.includes('service unavailable')) {
          errorMessage = "Username check service temporarily unavailable";
        } else if (err.message.includes('Failed to fetch')) {
          errorMessage = "Cannot connect to server. Please ensure backend is running on port 5000.";
        }
        
        setValidation(prev => ({
          ...prev,
          username: {
            isValid: true, // Allow submission even if check fails
            isChecking: false,
            message: errorMessage
          }
        }));
      }
    };

    const timeoutId = setTimeout(checkUsernameAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.username]);

  // API Handler: Real-time email validation
  useEffect(() => {
    const validateEmail = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = emailRegex.test(formData.email);
      
      setValidation(prev => ({
        ...prev,
        email: {
          isValid,
          isChecking: false,
          message: isValid ? "Valid email format" : "Please enter a valid email"
        }
      }));
    };

    if (formData.email) {
      validateEmail();
    }
  }, [formData.email]);

  // DOM Handler: Form submission with comprehensive validation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Enhanced validation: Allow submission if username check failed but other fields are valid
    const isFormValid = 
      validation.email.isValid && 
      validation.password.isValid && 
      validation.confirmPassword.isValid &&
      formData.username.length >= 3; // Basic username validation

    if (!isFormValid) {
      setError("Please fix validation errors before submitting");
      return;
    }

    // Warn user if username availability couldn't be verified
    if (validation.username.message.includes("unavailable") || 
        validation.username.message.includes("timed out") ||
        validation.username.message.includes("cannot connect")) {
      const proceed = window.confirm(
        "We couldn't verify if this username is available. " +
        "Would you like to try registering anyway? " +
        "If the username is taken, you'll need to choose a different one."
      );
      
      if (!proceed) return;
    }

    setIsLoading(true);

    try {
      // FIXED: Correct API URL - added /auth path
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle username already taken error from registration endpoint
        if (data.message && data.message.toLowerCase().includes('username')) {
          setValidation(prev => ({
            ...prev,
            username: {
              isValid: false,
              isChecking: false,
              message: "Username already taken - please choose another"
            }
          }));
          throw new Error("Username already taken");
        }
        
        // Handle email already registered
        if (data.message && data.message.toLowerCase().includes('email')) {
          setValidation(prev => ({
            ...prev,
            email: {
              isValid: false,
              isChecking: false,
              message: "Email already registered"
            }
          }));
          throw new Error("Email already registered");
        }
        
        throw new Error(data.message || `Registration failed: ${res.status}`);
      }

      // DOM Success Handling
      setSuccess("Account created successfully! Redirecting to login...");
      
      // DOM Navigation: Redirect to login after success
      setTimeout(() => {
        navigate("/login", { 
          state: { 
            signupSuccess: true,
            username: formData.username 
          } 
        });
      }, 2000);

    } catch (err) {
      // Error Handling: User-friendly error messages
      console.error("Signup error:", err);
      
      if (err.message.includes('Username already taken')) {
        setError("This username is already taken. Please choose a different username.");
      } else if (err.message.includes('Email already registered')) {
        setError("This email is already registered. Please use a different email or login.");
      } else if (err.message.includes('Failed to fetch')) {
        setError("Cannot connect to the server. Please ensure the backend is running on port 5000.");
      } else {
        setError(err.message || "Server error. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // DOM Helper: Get strength color based on password strength
  const getStrengthColor = () => {
    if (passwordStrength < 40) return "#ef4444"; // red
    if (passwordStrength < 70) return "#f59e0b"; // amber
    if (passwordStrength < 90) return "#10b981"; // green
    return "#059669"; // emerald
  };

  return (
    <div className="signup-container">
      {/* Background Visual Layer */}
      <div className="signup-background">
        <div className="floating-pets">
          <span className="pet-float pet-1">🐕</span>
          <span className="pet-float pet-2">🐱</span>
          <span className="pet-float pet-3">🐾</span>
          <span className="pet-float pet-4">❤️</span>
        </div>
        
        {/* Background Image Placeholder - Replace with actual image/video */}
        <div className="background-visual">
          {/* Replace this div with actual background video/image */}
          <div className="background-placeholder">
            <FaHeart className="placeholder-icon" />
            <p>Happy Pets Background</p>
            {/* Actual background code:
            <video autoPlay muted loop playsInline className="background-video">
              <source src="/videos/pets-playing.mp4" type="video/mp4" />
            </video>
            */}
          </div>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="signup-form-container">
        <div className="signup-form-card">


          
          
          {/* Header Section */}
          <div className="form-header">
            <div className="logo-section">
              <FaPaw className="logo-icon" />
              <h1>Join Our Pet Family</h1>
            </div>
            <p className="form-subtitle">
              Where tails wag and purrs happen - starting today!
            </p>
          </div>

          {/* Trust Badges */}
          <div className="trust-badges">
            <div className="trust-badge">
              <FaShieldAlt className="badge-icon" />
              <span>256-bit SSL Encrypted</span>
            </div>
            <div className="trust-badge">
              <FaHeart className="badge-icon" />
              <span>Veterinarian Recommended</span>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="message error-message">
              <FaTimes className="message-icon" />
              {error}
            </div>
          )}
          {success && (
            <div className="message success-message">
              <FaCheck className="message-icon" />
              {success}
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="signup-form">
            
            {/* Username Field */}
            <div className="form-group">
              <label className="form-label">
                <FaUser className="input-icon" />
                Username
              </label>
              <input
                type="text"
                className={`form-input ${
                  validation.username.isValid ? "valid" : 
                  validation.username.message && !validation.username.isValid ? "invalid" : ""
                }`}
                placeholder="Choose your username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                disabled={isLoading}
              />
              <div className="validation-feedback">
                {validation.username.isChecking && <span className="checking">Checking availability...</span>}
                {!validation.username.isChecking && validation.username.message && (
                  <span className={validation.username.isValid ? "valid" : "invalid"}>
                    {validation.username.message}
                  </span>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label className="form-label">
                <FaEnvelope className="input-icon" />
                Email Address
              </label>
              <input
                type="email"
                className={`form-input ${
                  validation.email.isValid ? "valid" : 
                  validation.email.message && !validation.email.isValid ? "invalid" : ""
                }`}
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isLoading}
              />
              <div className="validation-feedback">
                {validation.email.message && (
                  <span className={validation.email.isValid ? "valid" : "invalid"}>
                    {validation.email.message}
                  </span>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label">
                <FaLock className="input-icon" />
                Password
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`form-input ${
                    validation.password.isValid ? "valid" : 
                    formData.password ? "invalid" : ""
                  }`}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              
              {/* Password Strength Meter */}
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className="strength-fill"
                      style={{
                        width: `${passwordStrength}%`,
                        backgroundColor: getStrengthColor()
                      }}
                    ></div>
                  </div>
                  <div className="strength-text">
                    {validation.password.message}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label className="form-label">
                <FaLock className="input-icon" />
                Confirm Password
              </label>
              <div className="password-input-container">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={`form-input ${
                    validation.confirmPassword.isValid ? "valid" : 
                    formData.confirmPassword ? "invalid" : ""
                  }`}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="validation-feedback">
                {validation.confirmPassword.message && (
                  <span className={validation.confirmPassword.isValid ? "valid" : "invalid"}>
                    {validation.confirmPassword.message}
                  </span>
                )}
              </div>
            </div>

        {/* Submit Button */}
<button 
  type="submit" 
  className={`submit-button ${isLoading ? "loading" : ""}`}
  disabled={isLoading || 
    !validation.email.isValid || 
    !validation.confirmPassword.isValid ||
    formData.password.length < 6 ||
    formData.username.length < 3}
>
  {isLoading ? (
    <>
      <div className="loading-spinner"></div>
      Creating Account...
    </>
  ) : (
    <>
      <FaPaw className="button-icon" />
      Create My Account
    </>
  )}
</button>
          </form>

          {/* Login Redirect */}
          <div className="auth-redirect">
            <p>
              Already part of our pet family?{" "}
              <Link to="/login" className="redirect-link">
                Login here
              </Link>
            </p>
          </div>

          {/* Social Proof */}
          <div className="social-proof">
            <div className="proof-stats">
              <strong>15,342</strong> happy pet parents joined this month
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;