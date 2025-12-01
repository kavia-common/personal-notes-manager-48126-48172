import React, { useMemo } from "react";

// PUBLIC_INTERFACE
export default function Sidebar({
  notes,
  selectedId,
  onSelect,
  search,
  setSearch,
}) {
  const empty = !notes || notes.length === 0;

  const items = useMemo(() => notes, [notes]);

  return (
    <aside className="sidebar" aria-label="Notes list">
      <div className="search">
        <label htmlFor="search-input" className="sr-only">
          Search notes
        </label>
        <input
          id="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes..."
          aria-label="Search notes"
        />
      </div>

      {empty ? (
        <div className="empty-list" role="status" aria-live="polite">
          No notes yet. Create your first note.
        </div>
      ) : (
        <ul className="notes-list" role="listbox" aria-label="Notes">
          {items.map((n) => (
            <li key={n.id}>
              <button
                className={`note-item ${selectedId === n.id ? "active" : ""}`}
                onClick={() => onSelect(n.id)}
                role="option"
                aria-selected={selectedId === n.id}
              >
                <div className="note-title" title={n.title || "Untitled"}>
                  {n.title?.trim() || "Untitled"}
                </div>
                <div className="note-snippet">
                  {(n.content || "").slice(0, 80) || "No content"}
                </div>
                <div className="note-meta">
                  {new Date(n.updatedAt).toLocaleString()}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
