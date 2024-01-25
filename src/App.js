import React, { useState } from "react";
import SearchBar from "./SearchBar/SearchBar";
import SearchResults from "./SearchResults/SearchResults";
import Playlist from "./Playlist/Playlist";
import Spotify from "./Spotify";
import useSpotifyAuth from "./useSpotifyAuth"; // Importing the new hook
import "./App.css";

function App() {
  const accessToken = useSpotifyAuth(); // Using the new hook for authentication
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (query) => {
    if (!accessToken) {
      return;
    }
    Spotify.search(query, accessToken)
      .then((results) => {
        setSearchResults(results);
      })
      .catch((error) => {
        console.error("Error searching:", error);
      });
  };

  // Mock data for playlist
  const [playlistName, setPlaylistName] = useState("My Playlist");
  const [playlistTracks, setPlaylistTracks] = useState([
    // Existing mock tracks
  ]);

  const addTrackToPlaylist = (track) => {
    if (playlistTracks.find((savedTrack) => savedTrack.id === track.id)) {
      return; // Track already in playlist, do nothing
    }
    setPlaylistTracks([...playlistTracks, track]);
  };

  const removeTrackFromPlaylist = (track) => {
    setPlaylistTracks(
      playlistTracks.filter((savedTrack) => savedTrack.id !== track.id)
    );
  };

  const updatePlaylistName = (newName) => {
    setPlaylistName(newName);
  };

  const savePlaylist = () => {
    if (!accessToken || playlistTracks.length === 0 || !playlistName) {
      console.log("Missing access token, playlist name, or tracks.");
      return;
    }

    const trackURIs = playlistTracks.map((track) => track.uri);
    Spotify.getUserID(accessToken)
      .then((userID) =>
        Spotify.createPlaylist(userID, playlistName, accessToken)
      )
      .then((playlistID) =>
        Spotify.addTracksToPlaylist(playlistID, trackURIs, accessToken)
      )
      .then(() => {
        setPlaylistName("New Playlist");
        setPlaylistTracks([]);
        console.log("Playlist saved to Spotify.");
      })
      .catch((error) => console.error("Error saving playlist:", error));
  };

  return (
    <div className="App">
      <SearchBar onSearch={handleSearch} />
      <div className="App-playlist">
        <SearchResults
          searchResults={searchResults}
          onAdd={addTrackToPlaylist}
        />
        <Playlist
          playlistName={playlistName}
          playlistTracks={playlistTracks}
          onNameChange={updatePlaylistName} // Updated to use the correct function
          onRemove={removeTrackFromPlaylist}
          onSave={savePlaylist}
        />
      </div>
    </div>
  );
}

export default App;
