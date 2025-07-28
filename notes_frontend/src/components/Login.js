import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await login(username, password);
    setLoading(false);
    if (res.success) {
      // Go to previous page or home
      navigate(location.state?.from?.pathname || "/");
    } else {
      setError(res.error || "Login failed");
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Sign In</h2>
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
          autoComplete="current-password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
      </label>
      <button className="btn primary" type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
      <p>
        No account? <Link to="/signup">Sign Up</Link>
      </p>
    </form>
  );
}

export default Login;
