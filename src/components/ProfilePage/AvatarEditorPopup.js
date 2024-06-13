// AvatarEditorPopup.js
import React, { useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { uploadImage } from './api';
import './CSS/AvatarEditorPopup.css';

function AvatarEditorPopup({ file, fileType, userProfileUid, onClose, onSave }) {
  const [editor, setEditor] = useState(null);
  const [scale, setScale] = useState(1);
  const [uploading, setUploading] = useState(false);
  let width = 200;
  const height = 200;

  if (fileType !== 'avatar') {
    width = 600;
  }

  const handleSave = async () => {
    setUploading(true);
    try {
      const response = await uploadImage(userProfileUid, editor, fileType);
      onSave(response);
      onClose();
    } catch (error) {
      console.error(error);
      alert(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="popup-close" onClick={onClose}>×</button>
        <AvatarEditor
          ref={setEditor}
          image={file}
          width={width}
          height={height}
          border={50}
          color={[0, 0, 0, 0.6]}
          scale={scale}
          rotate={0}
          className="avatar-editor"
        />
        <div className="upload-overlay">
          <input
            type="range"
            min="1"
            max="2"
            step="0.01"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="scale-range"
          />
          <button onClick={handleSave} disabled={uploading} className="modern-button">
            {uploading ? "Uploading..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AvatarEditorPopup;
