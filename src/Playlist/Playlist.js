import React, { useState } from 'react';
import TrackList from '../TrackList/TrackList';
import './Playlist.css';

function Playlist({ playlistName, playlistTracks, onNameChange, onRemove, onSave }) {
  const [isEditing, setIsEditing] = useState(false);

  const handleNameChange = (e) => {
    onNameChange(e.target.value);
  };

  return (
    <div className="Playlist">
      <div className="Playlist-name-container">
        <input
          value={playlistName}
          onChange={handleNameChange}
          onFocus={() => setIsEditing(true)}
          onBlur={() => setIsEditing(false)}
          placeholder={isEditing ? "Enter playlist name" : "Click to edit playlist name"}
        />
        <span className="edit-icon">✏️</span>
      </div>
      <TrackList tracks={playlistTracks} onRemove={onRemove} isRemoval={true} />
      <button className="Playlist-save" onClick={onSave}>SAVE TO SPOTIFY</button>
    </div>
  );
}

export default Playlist;