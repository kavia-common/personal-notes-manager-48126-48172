import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * Notes data model
 * id: string
 * title: string
 * content: string (Markdown-friendly)
 * createdAt: number (timestamp)
 * updatedAt: number (timestamp)
 */

const STORAGE_KEY = "notes_app_data_v1";

export const NotesContext = createContext({
  notes: [],
  selectedId: null,
  search: "",
  setSearch: () => {},
  selectNote: () => {},
  createNote: () => {},
  updateNote: () => {},
  deleteNote: () => {},
  sortedFilteredNotes: [],
  selectedNote: null,
  saveNow: () => {},
});

/**
 * Persist notes to localStorage safely
 */
function saveToLocalStorage(notes) {
  try {
    const payload = JSON.stringify({ notes });
    localStorage.setItem(STORAGE_KEY, payload);
  } catch (e) {
    // Swallow errors to avoid crashing UI; realistically could surface non-blocking toast
    // eslint-disable-next-line no-console
    console.error("Failed to persist notes:", e);
  }
}

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.notes)) {
      return parsed.notes;
    }
    return [];
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("Failed to parse notes from storage, starting fresh.");
    return [];
  }
}

// PUBLIC_INTERFACE
export function NotesProvider({ children }) {
  /** Core state */
  const [notes, setNotes] = useState(() => loadFromLocalStorage());
  const [selectedId, setSelectedId] = useState(() => {
    const n = loadFromLocalStorage();
    return n.length ? n.sort((a, b) => b.updatedAt - a.updatedAt)[0].id : null;
  });
  const [search, setSearch] = useState("");

  // Debounce save
  const saveTimeoutRef = useRef(null);
  const scheduleSave = useCallback((pendingNotes) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveToLocalStorage(pendingNotes);
      saveTimeoutRef.current = null;
    }, 300);
  }, []);

  useEffect(() => {
    // Initial sync in case separate calls used different initializers
    saveToLocalStorage(notes);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    scheduleSave(notes);
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [notes, scheduleSave]);

  // PUBLIC_INTERFACE
  const selectNote = useCallback((id) => {
    setSelectedId(id);
  }, []);

  // PUBLIC_INTERFACE
  const createNote = useCallback(() => {
    const now = Date.now();
    const newNote = {
      id: `note_${now}_${Math.random().toString(36).slice(2, 8)}`,
      title: "Untitled note",
      content: "",
      createdAt: now,
      updatedAt: now,
    };
    setNotes((prev) => {
      const updated = [newNote, ...prev];
      return updated;
    });
    setSelectedId(newNote.id);
    return newNote.id;
  }, []);

  // PUBLIC_INTERFACE
  const updateNote = useCallback((id, patch) => {
    setNotes((prev) => {
      const updated = prev.map((n) =>
        n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n
      );
      return updated;
    });
  }, []);

  // PUBLIC_INTERFACE
  const deleteNote = useCallback((id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    setSelectedId((current) => {
      if (current !== id) return current;
      // select next most recent note
      const remaining = notes.filter((n) => n.id !== id).sort((a, b) => b.updatedAt - a.updatedAt);
      return remaining.length ? remaining[0].id : null;
    });
  }, [notes]);

  const sortedNotes = useMemo(
    () => [...notes].sort((a, b) => b.updatedAt - a.updatedAt),
    [notes]
  );

  const sortedFilteredNotes = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return sortedNotes;
    return sortedNotes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q)
    );
  }, [sortedNotes, search]);

  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedId) || null,
    [notes, selectedId]
  );

  // PUBLIC_INTERFACE
  const saveNow = useCallback(() => {
    saveToLocalStorage(notes);
  }, [notes]);

  const value = {
    notes,
    selectedId,
    search,
    setSearch,
    selectNote,
    createNote,
    updateNote,
    deleteNote,
    sortedFilteredNotes,
    selectedNote,
    saveNow,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}
