import React, { useEffect, useState } from 'react';
import { getTopTracks, getRecommendations, getSpotifyToken } from '../../../services/SpotifyService/SpotifyService';
import logo from '../../../assets/img/image.jpg';
import logout from '../../../assets/icons/cerrar-sesion.png';

export interface Track {
   id: string;
   name: string;
   artists: { name: string }[];
}

export function Home() {
   const [tracks, setTracks] = useState<Track[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [recommendedTracks, setRecommendedTracks] = useState<Track[]>([]);
   const playlistId = '1Vh0q3OVWonNG2dXOEgU6l'; // Define el ID de la lista de reproducción
   let tokenValidator: any;

   function handleLogout() {
      // Limpiar el localStorage
      localStorage.clear();
      // Redirigir al usuario a la página de inicio
      window.location.href = '/auth/login';
   }

   useEffect(() => {

      async function fetchTopTracks(tokenValidator: any) {
         console.log("donde esta?" , fetchTopTracks);
         try {
            const token = await getSpotifyToken(); // Obtiene el token de Spotify
            console.log("linea 33 ",token)
            const topTracks = await getTopTracks(token); // Obtiene las principales pistas con el token
            setTracks(topTracks); // Establece las pistas principales en el estado
            setLoading(false); // Cambia el estado de carga a falso
          
         } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false); // Asegura que el estado de carga se actualice incluso en caso de error
         }
      }

      async function fetchRecommendedTracks(tokenValidator: any) { //funciona
         try {
            console.log("entro a try fetchRecommendedTracks")
            tokenValidator = await getSpotifyToken();
            const recTracks = await getRecommendations(tokenValidator);
            setRecommendedTracks(recTracks);
            console.log('Recommended Albunes:', recTracks);
         } catch (error) {
            console.error('Error fetching recommended tracks:', error);
         }
      }

      fetchTopTracks(tokenValidator);
      fetchRecommendedTracks(tokenValidator);
   }, []);

   return (

      <div style={{ backgroundColor: 'var(--yellow)', color: 'var(--white)' }}>
         <img
            className="img-fluid"
            style={{ display: 'flex', cursor: 'pointer' }}
            src={logout}
            alt="cerrar session"
            width="50px"
            onClick={handleLogout}
         />
         <img
            className="img-fluid"
            style={{ display: 'flex', margin: '0 auto' }}
            src={logo}
            alt="logo"
            width="50%"
            height="300px"
         />
         <h2 style={{ color: 'var(--green)' }}>Lista de Reproducción Recomendada</h2>
         {<iframe
            title="Spotify Embed: Recommendation Playlist"
            src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
            width="100%"
            height="700px"
            style={{ minHeight: '360px' }}
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
         />}
         <h2 style={{ color: 'var(--green)' }}>Top de Canciones</h2>
         {loading ? (
            <p>Cargando...</p>
         ) : (
            <ul>
            {tracks.map(track => (
               <li key={track.id}>
                  {track.name} by {track.artists.map(artist => artist.name).join(', ')}
               </li>
            ))}
         </ul>

         )}

         <h2 style={{ color: 'var(--green)' }}>Álbumes Recomendados</h2>
         <ul>
            {recommendedTracks.map((track: Track) => (
               <li key={track.id}>
                  {track.name} by {track.artists.map((artist) => artist.name).join(', ')}
               </li>
            ))}
         </ul>
         <img
            className="img-fluid"
            style={{ display: 'flex', margin: '0 auto' }}
            src={logo}
            alt="logo"
            width="50%"
            height="300px"
         />
      </div>
   );
}
