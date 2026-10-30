import { useEffect, useRef } from "react";

function ConfirmDialog({ product, onConfirm, onCancel }) {
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    cancelButtonRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onCancel();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus();
      }
    };
  }, [onCancel]);

  return (
    <div className="dialog-backdrop">
      <section
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        aria-describedby="delete-description"
      >
        <span className="dialog-icon" aria-hidden="true">!</span>
        <h2 id="delete-title">Delete product?</h2>
        <p id="delete-description">
          Are you sure you want to delete <strong>{product.name}</strong>? This action cannot be undone.
        </p>
        <div className="dialog-actions">
          <button className="button button-quiet" ref={cancelButtonRef} onClick={onCancel}>
            Cancel
          </button>
          <button className="button button-danger" onClick={onConfirm}>
            Delete product
          </button>
        </div>
      </section>
    </div>
  );
}

export default ConfirmDialog;
