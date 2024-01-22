import { useState, useEffect } from 'react';

const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const redirectUri = process.env.REACT_APP_REDIRECT_URI;
const scopes = ['playlist-modify-public', 'playlist-modify-private'];
const authEndpoint = 'https://accounts.spotify.com/authorize';

const useSpotifyAuth = () => {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    console.log('useEffect triggered in useSpotifyAuth');

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    console.log('Access Token Match:', accessTokenMatch);
    console.log('Expires In Match:', expiresInMatch);

    if (accessTokenMatch && expiresInMatch) {
      const token = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);

      setAccessToken(token);
      console.log('Token set:', token);

      window.setTimeout(() => {
        console.log('Token expired, clearing access token');
        setAccessToken(null)
      }, expiresIn * 1000);

      window.history.pushState('Access Token', null, '/');
      console.log('URL parameters cleared');
    } else if (!accessToken) {
      console.log('Redirecting to Spotify login');
      const url = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(' ')}&response_type=token&show_dialog=true`;
      window.location = url;
    }
  }, [accessToken]);

  return accessToken;
};

export default useSpotifyAuth;
