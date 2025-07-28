import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <nav className="navbar">
      <Link className="navbar-title" to="/">🗒️ Notes</Link>
      <div className="navbar-links">
        {user ? (
          <>
            <span className="username">Hi, {user.username}</span>
            <Link className="nav-btn" to="/notes/new">+ New Note</Link>
            <button className="nav-btn accent" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link className="nav-btn" to="/login">Log In</Link>
            <Link className="nav-btn accent" to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
