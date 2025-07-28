import React, { createContext, useState, useContext, useEffect } from "react";

const API_BASE = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// PUBLIC_INTERFACE
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // user object, e.g., {id, username}
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount: check if token exists and fetch user info
    const token = localStorage.getItem("token");
    if (token) {
      fetch(API_BASE + "/api/user/me", {
        headers: { Authorization: "Bearer " + token },
      })
        .then((r) => r.ok ? r.json() : Promise.reject())
        .then((data) => {
          setUser(data);
          setLoading(false);
        })
        .catch(() => {
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // PUBLIC_INTERFACE
  const login = async (username, password) => {
    const res = await fetch(API_BASE + "/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok || res.status === 200) {
      const data = await res.json();
      localStorage.setItem("token", data.token);
      setUser(data.user);
      return { success: true };
    }
    let error = "Invalid credentials";
    try {
      const d = await res.json();
      error = d.message || error;
    } catch {}
    return { success: false, error };
  };

  // PUBLIC_INTERFACE
  const signup = async (username, password) => {
    const res = await fetch(API_BASE + "/api/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok || res.status === 201) {
      return await login(username, password);
    }
    let error = "Registration failed";
    try {
      const d = await res.json();
      error = d.message || error;
    } catch {}
    return { success: false, error };
  };

  // PUBLIC_INTERFACE
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        token: () => localStorage.getItem("token"),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
