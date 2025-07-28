import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import AuthProvider, { useAuth } from "./components/AuthContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import NoteList from "./components/NoteList";
import NoteView from "./components/NoteView";
import NoteForm from "./components/NoteForm";
import Login from "./components/Login";
import Signup from "./components/Signup";
import NotFound from "./components/NotFound";
import "./App.css";

// Handles theme switch button, applies CSS variables
function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}

// Protects routes so only authenticated users can access
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="center">Loading...</div>;
  return user ? children : <Navigate to="/login" replace state={{ from: location }} />;
}

function AppContent() {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Show sidebar only on protected (logged in) routes
  const location = useLocation();
  const authRoutes = ["/login", "/signup"];
  const showSidebar = !authRoutes.includes(location.pathname);

  return (
    <div className="App">
      <ThemeToggle theme={theme} onToggle={() => setTheme(t => (t === "light" ? "dark" : "light"))} />
      <Navbar />
      <div className="app-body">
        {showSidebar && <Sidebar />}
        <main className={`main-content${showSidebar ? "" : " full"}`}>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <NoteList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notes/new"
              element={
                <ProtectedRoute>
                  <NoteForm create />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notes/:id/edit"
              element={
                <ProtectedRoute>
                  <NoteForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notes/:id"
              element={
                <ProtectedRoute>
                  <NoteView />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// Root App with AuthProvider and Router
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
