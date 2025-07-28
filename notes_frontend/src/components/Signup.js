import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signup(username, password);
    setLoading(false);
    if (res.success) {
      navigate("/");
    } else {
      setError(res.error || "Signup failed");
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
      {error && <div className="err">{error}</div>}
      <label>
        Username
        <input
          type="text"
          autoComplete="username"
          value={username}
          required
          minLength={3}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />
      </label>
      <label>
        Password
        <input
          type="password"
          autoComplete="new-password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
      </label>
      <button className="btn accent" type="submit" disabled={loading}>
        {loading ? "Signing up..." : "Sign Up"}
      </button>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </form>
  );
}

export default Signup;
