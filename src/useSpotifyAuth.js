import { useState, useEffect } from 'react';

const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const redirectUri = process.env.REACT_APP_REDIRECT_URI;
const scopes = ['playlist-modify-public', 'playlist-modify-private'];
const authEndpoint = 'https://accounts.spotify.com/authorize';

const useSpotifyAuth = () => {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    // Parse the access token from the URL
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      const token = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);

      window.history.pushState('Access Token', null, '/'); // Clear URL parameters
      setAccessToken(token);

      // Set a timeout to clear the token after it expires
      window.setTimeout(() => setAccessToken(null), expiresIn * 1000);
    } else if (!accessToken) {
      // Redirect to Spotify login if there's no access token
      const url = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(' ')}&response_type=token&show_dialog=true`;
      window.location = url;
    }
  }, [accessToken]);

  return accessToken;
};

export default useSpotifyAuth;