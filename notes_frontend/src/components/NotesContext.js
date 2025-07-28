import React, { createContext, useState, useContext } from "react";

const NotesContext = createContext();

export function useNotesContext() {
  return useContext(NotesContext);
}

export default function NotesProvider({ children }) {
  const [filters, setFilters] = useState({ title: "", content: "", page: 1 });

  return (
    <NotesContext.Provider value={{ filters, setFilters }}>
      {children}
    </NotesContext.Provider>
  );
}
