import { useState, useEffect } from 'react';

const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const redirectUri = process.env.REACT_APP_REDIRECT_URI;
const scopes = ['playlist-modify-public', 'playlist-modify-private'];
const authEndpoint = 'https://accounts.spotify.com/authorize';

const useSpotifyAuth = () => {
  const [accessToken, setAccessToken] = useState(() => {
    const token = localStorage.getItem('spotifyAccessToken');
    const expiry = localStorage.getItem('spotifyTokenExpiry');
    const now = new Date();

    console.log('Initial token from localStorage:', token);

    if (token && expiry && now.getTime() < expiry) {
      return token;
    }

    localStorage.removeItem('spotifyAccessToken');
    localStorage.removeItem('spotifyTokenExpiry');
    return null;
  });

  useEffect(() => {
    console.log('useEffect triggered, accessToken:', accessToken);

    if (!accessToken) {
      const accessTokenMatch = window.location.hash.match(/#access_token=([^&]*)/);
      const expiresInMatch = window.location.hash.match(/expires_in=([^&]*)/);

      if (accessTokenMatch && expiresInMatch) {
        const token = accessTokenMatch[1];
        console.log('Token matched from URL:', token);

        const expiresIn = Number(expiresInMatch[1]);
        const now = new Date();
        const expiryTime = now.getTime() + expiresIn * 1000;
        console.log('Token expiry time:', new Date(expiryTime).toLocaleString());
        localStorage.setItem('spotifyTokenExpiry', expiryTime);
        localStorage.setItem('spotifyAccessToken', token);

        setAccessToken(token);

        console.log('Token set in state and localStorage:', token);

        window.setTimeout(() => {
          localStorage.removeItem('spotifyAccessToken');
          setAccessToken(null);
        }, expiresIn * 1000);

        window.history.pushState('', null, '/');
      } else if (!window.location.hash) {
        const authUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(' ')}&response_type=token&show_dialog=true`;
        window.location = authUrl;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Dependency array is now empty
  
  return accessToken;
};

export default useSpotifyAuth;