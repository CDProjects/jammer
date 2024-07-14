import { useState, useEffect, useRef } from 'react';

const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const redirectUri = 'https://cdprojects.github.io/jammer/';
const scopes = ['playlist-modify-public', 'playlist-modify-private'];
const authEndpoint = 'https://accounts.spotify.com/authorize';

const useSpotifyAuth = () => {
  const [accessToken, setAccessToken] = useState(null);
  const hasRedirected = useRef(false);

  useEffect(() => {
    const token = localStorage.getItem('spotifyAccessToken');
    const expiry = localStorage.getItem('spotifyTokenExpiry');
    const now = new Date().getTime();

    if (token && expiry && now < Number(expiry)) {
      setAccessToken(token);
      return;
    }

    const accessTokenMatch = window.location.hash.match(/#access_token=([^&]*)/);
    const expiresInMatch = window.location.hash.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      const newToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      const newExpiry = now + expiresIn * 1000;

      localStorage.setItem('spotifyAccessToken', newToken);
      localStorage.setItem('spotifyTokenExpiry', newExpiry);
      setAccessToken(newToken);

      window.history.pushState('', null, '/');
    } else if (!hasRedirected.current) {
      hasRedirected.current = true;
      const authUrl = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(' ')}&response_type=token&show_dialog=true`;
      window.location = authUrl;
    }
  }, []);

  return accessToken;
};

export default useSpotifyAuth;