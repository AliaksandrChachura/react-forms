import { useEffect } from 'react';

function Modal({
  children,
  isOpen,
  handleClose,
}: {
  children: React.ReactNode;
  isOpen: boolean;
  handleClose: () => void;
}) {
  useEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) =>
      e.key === 'Escape' ? handleClose() : null;
    document.body.addEventListener('keydown', closeOnEscapeKey);
    return () => {
      document.body.removeEventListener('keydown', closeOnEscapeKey);
    };
  }, [handleClose]);

  if (!isOpen) return null;

  return (
    <div className="modal">
      <button onClick={handleClose} className="close-btn">
        Close
      </button>
      <div className="modal-content">{children}</div>
    </div>
  );
}

export default Modal;
