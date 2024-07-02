import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar/SearchBar";
import SearchResults from "./SearchResults/SearchResults";
import Playlist from "./Playlist/Playlist";
import Spotify from "./Spotify";
import useSpotifyAuth from "./useSpotifyAuth";
import "./App.css";

function App() {
  const accessToken = useSpotifyAuth();
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState("My Playlist");
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (accessToken !== null) {
      setIsLoading(false);
    }
  }, [accessToken]);

  const handleSearch = (query) => {
    if (!accessToken) {
      setError("Please authenticate with Spotify to search.");
      return;
    }
    setIsLoading(true);
    setError(null);
    Spotify.search(query, accessToken)
      .then((results) => {
        setSearchResults(results);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error searching:", error);
        setError("An error occurred while searching. Please try again.");
        setIsLoading(false);
      });
  };

  const addTrackToPlaylist = (track) => {
    if (playlistTracks.find((savedTrack) => savedTrack.id === track.id)) {
      return;
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
    if (!accessToken) {
      setError("Please authenticate with Spotify to save your playlist.");
      return;
    }
    if (playlistTracks.length === 0 || !playlistName) {
      setError("Please add tracks to your playlist and give it a name.");
      return;
    }

    setIsLoading(true);
    setError(null);
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
        setIsLoading(false);
        console.log("Playlist saved to Spotify.");
      })
      .catch((error) => {
        console.error("Error saving playlist:", error);
        setError("An error occurred while saving the playlist. Please try again.");
        setIsLoading(false);
      });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      {error && <div className="error-message">{error}</div>}
      <SearchBar onSearch={handleSearch} />
      <div className="App-playlist">
        <SearchResults
          searchResults={searchResults}
          onAdd={addTrackToPlaylist}
        />
        <Playlist
          playlistName={playlistName}
          playlistTracks={playlistTracks}
          onNameChange={updatePlaylistName}
          onRemove={removeTrackFromPlaylist}
          onSave={savePlaylist}
        />
      </div>
    </div>
  );
}

export default App;