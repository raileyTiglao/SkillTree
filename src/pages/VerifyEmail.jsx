// src/pages/VerifyEmail.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCheckVerification = async () => {
    setLoading(true);
    await user.reload(); // refresh user state
    if (user.emailVerified) {
      navigate("/dashboard");
    } else {
      alert("❌ Still not verified. Please check your email.");
    }
    setLoading(false);
  };

  return (
    <div className="verify-email">
      <h2>Verify your email</h2>
      <p>We sent a verification link to {user?.email}</p>
      <button onClick={handleCheckVerification} disabled={loading}>
        {loading ? "Checking..." : "I've verified my email"}
      </button>
    </div>
  );
};

export default VerifyEmail;
