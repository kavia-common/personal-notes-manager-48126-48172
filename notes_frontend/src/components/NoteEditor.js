import React, { useEffect, useRef, useState } from "react";

// PUBLIC_INTERFACE
export default function NoteEditor({ note, onChange, onSave }) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const mountedRef = useRef(false);

  // Sync when note changes
  useEffect(() => {
    setTitle(note?.title || "");
    setContent(note?.content || "");
  }, [note?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Autosave with debounce: handled in parent via onChange updates; here we call onChange immediately on input
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    if (note?.id) {
      onChange({ title, content });
    }
  }, [title, content]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard: Ctrl/Cmd+S to save
  useEffect(() => {
    const handler = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      if ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (onSave) onSave();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onSave]);

  if (!note) return null;

  return (
    <div className="editor" aria-label="Note editor">
      <div className="field">
        <label htmlFor="note-title">Title</label>
        <input
          id="note-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
        />
      </div>
      <div className="field">
        <label htmlFor="note-content">Content</label>
        <textarea
          id="note-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note here... (Markdown supported in future)"
          rows={14}
        />
      </div>
      <div className="save-hint">Auto-saved • Press Ctrl/Cmd+S to force save</div>
    </div>
  );
}
