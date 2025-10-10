// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import Dashboard from "./Dashboard";
import "../styles/app.css";
import Header from "../components/common/Header";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ✅ Separate loading states
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Email/Password login
  const handleLogin = async () => {
    setIsLoadingEmail(true);
    setMessage("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("✅ Login successful! Redirecting...");
    } catch (error) {
      setMessage("❌ " + error.message);
    } finally {
      setIsLoadingEmail(false);
    }
  };

  // Google Sign-In
  const handleGoogleSignIn = async () => {
    setIsLoadingGoogle(true);
    setMessage("");
    try {
      await signInWithPopup(auth, googleProvider);
      setMessage("✅ Logged in with Google!");
    } catch (error) {
      setMessage("❌ " + error.message);
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  // Redirect to Dashboard if logged in
  if (user) return <Dashboard />;

  return (
    <div className="app-container">
      {/* ✅ Reusable Header */}
      <Header />

      <div className="bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <main className="main-content">
        <div className="login-card">
          <div className="card-header">
            <h2 className="login-title">Log-in</h2>
            <p className="login-subtitle">
              Welcome Back! Let's take you to your account.
            </p>
          </div>

          {/* Google Sign-In Button */}
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
                  Signing in with Google...
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

          {/* Email/Password Form */}
          <div className="input-group">
            <div className="input-container">
              <div className="input-icon email-input-icon" />
              <input
                type="email"
                placeholder="Email Address"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <div className="input-border" />
            </div>

            <div className="input-container">
              <div className="input-icon password-input-icon" />
              <input
                type="password"
                placeholder="Password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <div className="input-border" />
            </div>
          </div>

          <Link to="/reset-password" className="reset-link">
            Reset your password?
          </Link>

          {/* Continue Button with Spinner */}
          <button
            className="continue-btn"
            onClick={handleLogin}
            disabled={isLoadingEmail || !email || !password}
          >
            <span className="btn-text">
              {isLoadingEmail ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : (
                "Continue"
              )}
            </span>
            <div className="btn-bg" />
            <div className="btn-glow-effect" />
          </button>

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
            Don't have an account?{" "}
            <Link to="/signup" className="signup-link">
              Sign-up
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
