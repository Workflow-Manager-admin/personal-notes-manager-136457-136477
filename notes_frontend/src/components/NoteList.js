import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNotesContext } from "./NotesContext";
import { useAuth } from "./AuthContext";

const API_BASE = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

// PUBLIC_INTERFACE
function NoteList() {
  const { filters, setFilters } = useNotesContext();
  const { token } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError("");
    let url = API_BASE + "/api/notes/?";
    const params = new URLSearchParams();
    if (filters.title) params.append("title", filters.title);
    if (filters.content) params.append("content", filters.content);
    params.append("page", filters.page || 1);
    params.append("per_page", 10);
    url += params.toString();

    fetch(url, {
      headers: { Authorization: "Bearer " + token() },
    })
      .then((r) => r.ok ? r.json() : Promise.reject(r))
      .then((data) => {
        setNotes(Array.isArray(data) ? data : []);
        setHasMore(Array.isArray(data) && data.length === 10);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load notes");
        setLoading(false);
      });

    // eslint-disable-next-line
  }, [filters.title, filters.content, filters.page]);

  const nextPage = () => setFilters(f => ({ ...f, page: (f.page || 1) + 1 }));
  const prevPage = () => setFilters(f => ({ ...f, page: Math.max(1, (f.page || 1) - 1) }));

  return (
    <section>
      <h2>My Notes</h2>
      {error && <div className="err">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : notes.length === 0 ? (
        <div>No notes found.</div>
      ) : (
        <ul className="note-list">
          {notes.map((note) => (
            <li key={note.id}>
              <Link to={`/notes/${note.id}`}>
                <div className="note-title">{note.title}</div>
                <div className="note-date">
                  {new Date(note.updated_at || note.created_at).toLocaleString()}
                </div>
                <div className="note-content-preview">
                  {note.content.length > 60
                    ? note.content.slice(0, 57) + "..."
                    : note.content}
                </div>
              </Link>
              <Link className="note-edit-link" to={`/notes/${note.id}/edit`}>
                Edit
              </Link>
            </li>
          ))}
        </ul>
      )}
      <div className="pagination">
        <button disabled={filters.page <= 1} onClick={prevPage}>
          Previous
        </button>
        <span>Page {filters.page}</span>
        <button disabled={!hasMore} onClick={nextPage}>
          Next
        </button>
      </div>
    </section>
  );
}

export default NoteList;
