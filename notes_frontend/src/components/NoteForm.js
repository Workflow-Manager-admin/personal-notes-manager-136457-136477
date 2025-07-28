import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "./AuthContext";

const API_BASE = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

// PUBLIC_INTERFACE
function NoteForm({ create }) {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!create && id) {
      setLoading(true);
      fetch(`${API_BASE}/api/notes/${id}`, {
        headers: { Authorization: "Bearer " + token() },
      })
        .then((r) => r.ok ? r.json() : Promise.reject())
        .then((data) => {
          setTitle(data.title);
          setContent(data.content);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to load note.");
          setLoading(false);
        });
    }
    // eslint-disable-next-line
  }, [id, create]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const method = create ? "POST" : "PUT";
    const url = create ? `${API_BASE}/api/notes/` : `${API_BASE}/api/notes/${id}`;
    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token(),
      },
      body: JSON.stringify({ title, content }),
    })
      .then((r) => {
        if (r.ok) return r.json();
        return r.json().then((d) => Promise.reject(d));
      })
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        setError(err.message || "Failed to save note.");
        setLoading(false);
      });
  };

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <h2>{create ? "New Note" : "Edit Note"}</h2>
      {error && <div className="err">{error}</div>}
      <label>
        Title
        <input
          type="text"
          value={title}
          maxLength={120}
          required
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
      </label>
      <label>
        Content
        <textarea
          rows={10}
          value={content}
          required
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
        />
      </label>
      <button className="btn primary" type="submit" disabled={loading}>
        {loading ? "Saving..." : (create ? "Create" : "Save")}
      </button>
    </form>
  );
}

export default NoteForm;
