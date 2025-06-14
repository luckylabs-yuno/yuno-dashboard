import React, { useEffect, useRef } from 'react';
import FocusTrap from 'focus-trap-react';

export default function Modal({ isOpen, onClose, title, children }) {
  const closeButtonRef = useRef();

  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50" aria-hidden="true">
      <FocusTrap>
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="bg-white rounded-xl shadow-card p-6 max-w-lg mx-auto my-24 outline-none"
        >
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-4 right-4 text-mid-gray hover:text-charcoal focus:outline-none focus:ring-2 focus:ring-accent-blue rounded-full p-1"
          >
            ×
          </button>
          <h2 id="modal-title" className="text-xl font-heading text-charcoal mb-4">
            {title}
          </h2>
          <div>{children}</div>
        </div>
      </FocusTrap>
    </div>
  );
}
