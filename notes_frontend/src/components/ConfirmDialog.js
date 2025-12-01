import React from "react";

// PUBLIC_INTERFACE
export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="dialog">
        <h3 id="confirm-title">{title || "Confirm"}</h3>
        <p>{message || "Are you sure?"}</p>
        <div className="dialog-actions">
          <button className="btn" onClick={onCancel} autoFocus>
            Cancel
          </button>
          <button className="btn danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
