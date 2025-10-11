// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/app.css";
import Header from "../components/common/Header";
import { sendEmailVerification } from "firebase/auth";

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

  const { signup, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 4000);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const { fullName, email, password, confirmPassword } = formData;

  if (!fullName || !email || !password || !confirmPassword) {
    return showMessage("❌ Please fill in all fields");
  }
  if (password !== confirmPassword) {
    return showMessage("❌ Passwords do not match");
  }

  setIsLoadingEmail(true);
  try {

    // Create account (signup already sends verification)
await signup(email, password, fullName);

// Show info message instead of redirecting
// After sendEmailVerification
showMessage("📧 Verification email sent! Please check your inbox.");
setTimeout(() => navigate("/verify-email"), 2000);


    // ❌ Remove navigate("/dashboard") here
    // ✅ Instead, redirect them to login
    setTimeout(() => navigate("/login"), 4000);

  } catch (err) {
    showMessage("❌ " + err.message);
  } finally {
    setIsLoadingEmail(false);
  }
};


  const handleGoogleSignIn = async () => {
    setIsLoadingGoogle(true);
    try {
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      showMessage("❌ " + err.message);
    } finally {
      setIsLoadingGoogle(false);
    }
  };
  
  return (
    <div className="app-container">
      <Header />

      {/* Background Orbs */}
      <div className="bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <main className="main-content">
        {/* ✅ Use signup-card instead of login-card */}
        <div className="signup-card">
  <div className="card-header">
    <h2 className="login-title">Sign Up</h2>
    <p className="login-subtitle">Create your SkillTree account.</p>
  </div>


          {/* Google Sign Up */}
          <button
            className="email-btn"
            onClick={handleGoogleSignIn}
            disabled={isLoadingGoogle}
          >
            <div className="email-icon" />
            <span>
              {isLoadingGoogle ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing up with Google...
                </div>
              ) : (
                "Continue with Google"
              )}
            </span>
            <div className="btn-shimmer" />
          </button>

          <div className="divider">
            <div className="divider-line" />
            <span className="divider-text">or</span>
            <div className="divider-line" />
          </div>

          <form onSubmit={handleSubmit} className="input-group">
            {/* Full Name */}
            <div className="input-container">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                className="form-input"
                value={formData.fullName}
                onChange={handleInputChange}
              />
              <div className="input-border" />
            </div>

            {/* Email */}
            <div className="input-container">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="form-input"
                value={formData.email}
                onChange={handleInputChange}
              />
              <div className="input-border" />
            </div>

            {/* Password */}
            <div className="input-container relative">
            <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="form-input"
                value={formData.password}
                onChange={handleInputChange}
            />
            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10"
            >
                {showPassword ? (
                <FaEyeSlash size={20} className="text-white" />
                ) : (
                <FaEye size={20} className="text-white" />
                )}
            </button>
            <div className="input-border" />
            </div>

            {/* Confirm Password */}
            <div className="input-container relative">
            <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleInputChange}
            />
            <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10"
            >
                {showConfirmPassword ? (
                <FaEyeSlash size={20} className="text-white" />
                ) : (
                <FaEye size={20} className="text-white" />
                )}
            </button>
            <div className="input-border" />
            </div>



            {/* Create Account Button */}
            <button
              type="submit"
              className="continue-btn"
              disabled={isLoadingEmail}
            >
              <span className="btn-text">
                {isLoadingEmail ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </span>
              <div className="btn-bg" />
              <div className="btn-glow-effect" />
            </button>
          </form>

          {message && (
            <div
              className={`message ${
                message.includes("✅") ? "success" : "error"
              }`}
            >
              {message}
            </div>
          )}

          <p className="signup-text">
            Already have an account?{" "}
            <a href="/login" className="signup-link">
              Log in
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Signup;
