import React, { useState } from 'react';
import './Track.css';

function AudioPreview({ previewUrl }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef(new Audio(previewUrl));

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button className="Track-preview" onClick={togglePlay}>
      {isPlaying ? '⏹️' : '▶️'}
    </button>
  );
}

function Track({ track, onAdd, onRemove, isRemoval }) {
  const addTrack = () => {
    onAdd(track);
  };

  const removeTrack = () => {
    onRemove(track);
  };

  return (
    <div className="Track">
      <div className="Track-information">
        <h3>{track.name}</h3>
        <p>{track.artist} | {track.album}</p>
      </div>
      {track.preview_url && <AudioPreview previewUrl={track.preview_url} />}
      {
        isRemoval 
        ? <button className="Track-action" onClick={removeTrack}>-</button>
        : <button className="Track-action" onClick={addTrack}>+</button>
      }
    </div>
  );
}

export default Track;