import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

const API_BASE = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

// PUBLIC_INTERFACE
function NoteView() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/notes/${id}`, {
      headers: { Authorization: "Bearer " + token() },
    })
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data) => setNote(data))
      .catch(() => setError("Failed to load note."));
    // eslint-disable-next-line
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this note?")) return;
    const res = await fetch(`${API_BASE}/api/notes/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token() },
    });
    if (res.ok) {
      navigate("/");
    } else {
      setError("Failed to delete note.");
    }
  };

  if (error) return <div className="err">{error}</div>;
  if (!note) return <div>Loading...</div>;

  return (
    <article className="note-view">
      <header>
        <h2>{note.title}</h2>
        <div className="note-date">
          Updated: {new Date(note.updated_at || note.created_at).toLocaleString()}
        </div>
      </header>
      <div className="note-content">
        <pre>{note.content}</pre>
      </div>
      <footer className="note-footer">
        <Link className="btn" to={`/notes/${id}/edit`}>
          Edit
        </Link>
        <button className="btn danger" onClick={handleDelete}>
          Delete
        </button>
      </footer>
    </article>
  );
}

export default NoteView;
