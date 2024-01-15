import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar/SearchBar';
import SearchResults from './SearchResults/SearchResults';
import Playlist from './Playlist/Playlist';
import Spotify from './Spotify';
import './App.css';

function App() {
  useEffect(() => {
    Spotify.getAccessToken(); // Ensure we have an access token
  }, []);
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
    { id: 1, name: 'Track 1', artist: 'Artist 1', album: 'Album 1', uri: 'spotify:track:5Er1BdhfwUWxWFO8pxAYwD' },
    { id: 2, name: 'Track 2', artist: 'Artist 2', album: 'Album 2', uri: 'spotify:track:1tqArbKc1vM3R0BgeZ6055' },
    // Add more tracks as needed
  ]);

  const addTrackToPlaylist = (track) => {
    if (playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return; // Track already in playlist, do nothing
    }
    setPlaylistTracks([...playlistTracks, track]);
  };

  const removeTrackFromPlaylist = (track) => {
    setPlaylistTracks(playlistTracks.filter(savedTrack => savedTrack.id !== track.id));
  };

  const updatePlaylistName = (newName) => {
    setPlaylistName(newName);
  };

  const savePlaylist = () => {
    const trackURIs = playlistTracks.map(track => track.uri);
    console.log('Saving playlist to Spotify with URIs:', trackURIs);
    // Here you will eventually interact with the Spotify API

    // Reset the playlist after saving
    setPlaylistName('New Playlist');
    setPlaylistTracks([]);
  };

  return (
    <div className="App">
      <SearchBar />
      <div className="App-playlist">
        <SearchResults searchResults={searchResults} onAdd={addTrackToPlaylist} />
        <Playlist 
          playlistName={playlistName} 
          playlistTracks={playlistTracks}
          onNameChange={setPlaylistName}
          onRemove={removeTrackFromPlaylist}
          onSave={savePlaylist}
        />
      </div>
    </div>
  );
}

export default App;