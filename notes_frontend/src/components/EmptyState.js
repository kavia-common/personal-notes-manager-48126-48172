import React from "react";

// PUBLIC_INTERFACE
export default function EmptyState({ onCreate }) {
  return (
    <div className="empty-state" role="status" aria-live="polite">
      <h2>Welcome to Notes</h2>
      <p>Create a new note to get started.</p>
      <button className="btn primary" onClick={onCreate}>
        + New note
      </button>
    </div>
  );
}
