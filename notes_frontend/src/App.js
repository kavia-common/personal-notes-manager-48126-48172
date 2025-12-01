import React, { useContext, useEffect, useMemo, useState } from "react";
import "./App.css";
import { NotesContext, NotesProvider } from "./context/NotesContext";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import NoteEditor from "./components/NoteEditor";
import EmptyState from "./components/EmptyState";
import ConfirmDialog from "./components/ConfirmDialog";
import { ErrorBoundary } from "./components/ErrorBoundary";

// PUBLIC_INTERFACE
export function AppShell() {
  const {
    sortedFilteredNotes,
    selectedId,
    selectNote,
    search,
    setSearch,
    selectedNote,
    createNote,
    updateNote,
    deleteNote,
    saveNow,
  } = useContext(NotesContext);

  const [confirmOpen, setConfirmOpen] = useState(false);

  // Keyboard: Ctrl/Cmd+N for new note
  useEffect(() => {
    const handler = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      if ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        createNote();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [createNote]);

  const hasNotes = useMemo(() => sortedFilteredNotes.length > 0, [sortedFilteredNotes]);

  const onEditorChange = (patch) => {
    if (selectedNote?.id) {
      updateNote(selectedNote.id, patch);
    }
  };

  const onDelete = () => {
    if (!selectedNote?.id) return;
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    const id = selectedNote?.id;
    setConfirmOpen(false);
    if (id) {
      deleteNote(id);
    }
  };

  return (
    <div className="app-root">
      <Header onNew={createNote} onDelete={onDelete} canDelete={!!selectedNote} />
      <div className="content">
        <Sidebar
          notes={sortedFilteredNotes}
          selectedId={selectedId}
          onSelect={selectNote}
          search={search}
          setSearch={setSearch}
        />
        <main className="main" aria-label="Main content">
          {!hasNotes ? (
            <EmptyState onCreate={createNote} />
          ) : !selectedNote ? (
            <div className="placeholder">Select a note from the left to view or edit.</div>
          ) : (
            <NoteEditor note={selectedNote} onChange={onEditorChange} onSave={saveNow} />
          )}
        </main>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete note?"
        message="This action cannot be undone."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  // Theme handling using Ocean Professional defaults
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "ocean");
  }, []);

  return (
    <ErrorBoundary>
      <NotesProvider>
        <AppShell />
      </NotesProvider>
    </ErrorBoundary>
  );
}

export default App;
