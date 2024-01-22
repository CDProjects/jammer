import { useState, useEffect } from 'react';

const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const redirectUri = process.env.REACT_APP_REDIRECT_URI;
const scopes = ['playlist-modify-public', 'playlist-modify-private'];
const authEndpoint = 'https://accounts.spotify.com/authorize';

const useSpotifyAuth = () => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('spotifyAccessToken'));

  useEffect(() => {
    if (!accessToken) {
      const accessTokenMatch = window.location.hash.match(/#access_token=([^&]*)/);
      const expiresInMatch = window.location.hash.match(/expires_in=([^&]*)/);

      if (accessTokenMatch && expiresInMatch) {
        const token = accessTokenMatch[1];
        const expiresIn = Number(expiresInMatch[1]);

        localStorage.setItem('spotifyAccessToken', token);
        setAccessToken(token);

        window.setTimeout(() => {
          localStorage.removeItem('spotifyAccessToken');
          setAccessToken(null);
        }, expiresIn * 1000);

        window.history.pushState('Access Token', null, '/');
      } else if (!window.location.hash) {
        window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(' ')}&response_type=token&show_dialog=true`;
      }
    }
  }, [accessToken]);

  return accessToken;
};

export default useSpotifyAuth;
