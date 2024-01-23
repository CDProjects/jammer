const Spotify = {
  search(term, accessToken) {
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    .then(response => response.json())
    .then(jsonResponse => {
      if (!jsonResponse.tracks) {
        return [];
      }
      return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }));
    });
  },

  getUserID(accessToken) {
    return fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    .then(response => response.json())
    .then(jsonResponse => {
      if (!jsonResponse.id) {
        throw new Error('User ID not found');
      }
      return jsonResponse.id;
    });
  },

  createPlaylist(userID, playlistName, accessToken) {
    return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: playlistName })
    })
    .then(response => response.json())
    .then(jsonResponse => {
      if (!jsonResponse.id) {
        throw new Error('Playlist ID not found');
      }
      return jsonResponse.id;
    });
  },

  addTracksToPlaylist(playlistID, trackURIs, accessToken) {
    return fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ uris: trackURIs })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to add tracks to the playlist');
      }
    });
  },

  // Additional API methods can be added here
};

export default Spotify;