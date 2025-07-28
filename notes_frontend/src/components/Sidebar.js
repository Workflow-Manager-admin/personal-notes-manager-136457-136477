import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useNotesContext } from "./NotesContext";

// Sidebar with note search/filter fields
function Sidebar() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { setFilters } = useNotesContext();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ title, content, page: 1 });
    // always return to root note list page on search
    if (location.pathname !== "/") navigate("/");
  };

  return (
    <aside className="sidebar">
      <form className="search-form" onSubmit={handleSearch}>
        <h3>Search Notes</h3>
        <input
          type="text"
          placeholder="Title"
          value={title}
          aria-label="title search"
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Content"
          value={content}
          aria-label="content search"
          onChange={(e) => setContent(e.target.value)}
        />
        <button className="btn primary" type="submit">
          Search
        </button>
      </form>
    </aside>
  );
}

export default Sidebar;
