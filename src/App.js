import React, { useState, useEffect, useCallback } from "react";
import Header from "./Header";
import SearchBar from "./SearchBar/SearchBar";
import SearchResults from "./SearchResults/SearchResults";
import Playlist from "./Playlist/Playlist";
import Spinner from "./Spinner";
import Spotify from "./Spotify";
import useSpotifyAuth from "./useSpotifyAuth";
import "./App.css";

function App() {
  const accessToken = useSpotifyAuth();
  const [allSearchResults, setAllSearchResults] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState("My Playlist");
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const updateFilteredSearchResults = useCallback(() => {
    setSearchResults(allSearchResults.filter(
      (track) => !playlistTracks.some((playlistTrack) => playlistTrack.id === track.id)
    ));
  }, [allSearchResults, playlistTracks]);

  useEffect(() => {
    if (accessToken !== null) {
      setIsLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    updateFilteredSearchResults();
  }, [updateFilteredSearchResults]);

  const handleSearch = (query) => {
    if (!accessToken) {
      setError("Please authenticate with Spotify to search.");
      return;
    }
    setIsLoading(true);
    setError(null);
    Spotify.search(query, accessToken)
      .then((results) => {
        setAllSearchResults(results);
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
    setPlaylistTracks((prevTracks) => [...prevTracks, track]);
  };

  const removeTrackFromPlaylist = (track) => {
    setPlaylistTracks((prevTracks) =>
      prevTracks.filter((savedTrack) => savedTrack.id !== track.id)
    );
  };

  const updatePlaylistName = (newName) => {
    setPlaylistName(newName);
  };

  const confirmSavePlaylist = () => {
    if (playlistTracks.length === 0 || !playlistName) {
      setError("Please add tracks to your playlist and give it a name.");
      return;
    }
    setShowConfirmation(true);
  };

  const savePlaylist = () => {
    if (!accessToken) {
      setError("Please authenticate with Spotify to save your playlist.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setShowConfirmation(false);
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
        setError(
          "An error occurred while saving the playlist. Please try again."
        );
        setIsLoading(false);
      });
  };

  const cancelSavePlaylist = () => {
    setShowConfirmation(false);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (!accessToken) {
    return <Spinner />;
  }

  return (
    <div className="App">
      <Header />
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
          onSave={confirmSavePlaylist}
        />
      </div>
      {showConfirmation && (
        <div className="confirmation-dialog">
          <p>Are you sure you want to save this playlist to Spotify?</p>
          <button onClick={savePlaylist}>Yes</button>
          <button onClick={cancelSavePlaylist}>No</button>
        </div>
      )}
    </div>
  );
}

export default App;