const token = 'BQDanK1nQG8pEIrCcwz4crMNFeHgtTSwIPapfY1YrtB9kHqtcsKOAzBsPtdnublBeaER7-h_WQ2qNyWlO8kEk3O7KEfzN4zKS-UEiQoUEzTC43zuujHY1TtHzcHLoDTvXAs-Nr_YCBUQW26wr6-DCFHccjglmt08rUT6SfmZZdDI_Ip7q97zdMTd6M59BQK81uHSqUN1D6RQSGymlAt_QKrG97PRlzhpNstIkR1ZL5UfbojbgCgyj6duSoRZG6HyWw'; //token toca cambiarlo cada 15 minutos o se rompe la app
const SPOTIFY_CLIENT_ID = 'bace9819bb5c41b0aed31ae8411ac556';
const SPOTIFY_CLIENT_SECRET = 'dd4390dc12b2486cb58f49bba6c0a27a';

async function fetchWebApi(endpoint: string, method: string, body?: any) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body: JSON.stringify(body)
  });
  return await res.json();
}

export async function getTopTracks() {
  try {
    const tokenValidator = await getSpotifyToken();
    return (await fetchWebApi(
      'v1/me/top/tracks?time_range=long_term&limit=50', 'GET',
    )).items;
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    throw error;
  }
}

export async function getRecommendations() {
  try {
    const topTracksIds = [
      '5zaIVQv1oPnTa86BUmmbjz', '6vYQaurynY7NoHd6Iw85QM', '79fkYjEJlscHdgAtYWYfUO', '3qXZqXGniqNt3PK2CBSZgF', 
    ];
  
   
    return (await fetchWebApi(
      `v1/recommendations?limit=5&seed_tracks=${topTracksIds.join(',')}`, 'GET'
    )).tracks;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error;
  }  
}

export async function getSpotifyToken() {
    const tokenDataString = localStorage.getItem('spotifyToken');
    const tokenData =  tokenDataString ? JSON.parse(tokenDataString) : null;
    console.log(tokenData);
    // Verificar si el token almacenado está vigente
    if (tokenData && tokenData.token && new Date(tokenData.expiresAt) > new Date()) {
      return tokenData.token; // Devolver el token almacenado
    } else {
      // Si el token ha expirado o no está presente, solicitar uno nuevo
      return fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET)
        },
        body: 'grant_type=client_credentials'
      })
      .then(response => response.json())
      .then(data => {
        const expiresInMilliseconds = data.expires_in * 1000; // Convertir a milisegundos
        const expirationDate = new Date(Date.now() + expiresInMilliseconds);
  
        // Guardar el nuevo token y la fecha de vencimiento en el localStorage
        localStorage.setItem('spotifyToken', JSON.stringify({
          token: data.access_token,
          expiresAt: expirationDate.toISOString() // Convertir a formato ISO
        }));
  
        return data.access_token; // Devolver el nuevo token
      })
      .catch(error => {
        console.error('Error al obtener el token de Spotify:', error);
        throw error;
      });
    }
  }

