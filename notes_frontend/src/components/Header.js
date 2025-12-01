import React from "react";

// PUBLIC_INTERFACE
export default function Header({ onNew, onDelete, canDelete }) {
  return (
    <header className="app-header" aria-label="Application header">
      <div className="brand">
        <span className="logo" aria-hidden="true">📝</span>
        <h1 className="title">Notes</h1>
      </div>
      <div className="actions">
        <button className="btn primary" onClick={onNew} aria-label="Create new note">
          + New (Ctrl/Cmd+N)
        </button>
        <button
          className="btn danger"
          onClick={onDelete}
          disabled={!canDelete}
          aria-disabled={!canDelete}
          aria-label="Delete selected note"
        >
          Delete
        </button>
      </div>
    </header>
  );
}
