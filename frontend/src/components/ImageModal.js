import React from 'react';
import './ImageModal.css';

const ImageModal = ({ src, alt, onClose }) => {
  if (!src) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="image-modal" onClick={handleBackdropClick}>
      <div className="image-modal-content">
        <button className="image-modal-close" onClick={onClose}>&times;</button>
        <img src={src} alt={alt} />
      </div>
    </div>
  );
};

export default ImageModal;