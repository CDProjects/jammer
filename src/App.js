import React, { useState } from 'react';
import SearchBar from './SearchBar/SearchBar';
import SearchResults from './SearchResults/SearchResults';
import Playlist from './Playlist/Playlist';
import './App.css';

function App() {
  // Mock data for search results
  const [searchResults, setSearchResults] = useState([
    { id: 1, name: 'Track Name 1', artist: 'Artist 1', album: 'Album 1' },
    { id: 2, name: 'Track Name 2', artist: 'Artist 2', album: 'Album 2' },
    // Add more tracks as needed
  ]);

  // Mock data for playlist
  const [playlistName, setPlaylistName] = useState('My Playlist');
  const [playlistTracks, setPlaylistTracks] = useState([
    { id: 3, name: 'Track Name 3', artist: 'Artist 3', album: 'Album 3' },
    { id: 4, name: 'Track Name 4', artist: 'Artist 4', album: 'Album 4' },
    // Add more tracks as needed
  ]);

  return (
    <div className="App">
      <SearchBar />
      <div className="App-playlist">
        <SearchResults searchResults={searchResults} />
        <Playlist playlistName={playlistName} playlistTracks={playlistTracks} />
      </div>
    </div>
  );
}

export default App;