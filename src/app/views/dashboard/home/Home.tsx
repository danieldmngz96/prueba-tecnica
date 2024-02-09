import React, { useEffect, useState } from 'react';
import { getTopTracks, getRecommendations } from '../../../services/SpotifyService/SpotifyService';
import logo from '../../../assets/img/image.jpg';
import logout from '../../../assets/icons/cerrar-sesion.png';
interface Track {
   id: string;
   name: string;
   artists: { name: string }[];
}

export function Home() {
   const [tracks, setTracks] = useState<Track[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [recommendedTracks, setRecommendedTracks] = useState<Track[]>([]);
   const playlistId = '1Vh0q3OVWonNG2dXOEgU6l'; // Define el ID de la lista de reproducción

   function handleLogout() {
      // Limpiar el localStorage
      localStorage.clear();
      // Redirigir al usuario a la página de inicio
      window.location.href = '/auth/login'; 
    } 

   useEffect(() => {
      async function fetchTopTracks() {
         try {
            const topTracks = await getTopTracks();
            setTracks(topTracks);
            setLoading(false);
         } catch (error) {
            console.error('Error fetching top tracks:', error);
         }
      }

      async function fetchRecommendedTracks() {
         try {
            const recTracks = await getRecommendations();
            setRecommendedTracks(recTracks);
            console.log('Recommended Tracks:', recTracks);
         } catch (error) {
            console.error('Error fetching recommended tracks:', error);
         }
      }

      fetchTopTracks();
      fetchRecommendedTracks();
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

         <h2 style={{ color: 'var(--green)' }}>Albunes Recomendadas</h2>
         <ul>
            {recommendedTracks.map(track => (
               <li key={track.id}>
                  {track.name} by {track.artists.map(artist => artist.name).join(', ')}
               </li>
            ))}
         </ul>
         <img
            className="img-fluid"
            style={{ display: 'flex', margin: '0 auto'}}
            src={logo}
            alt="logo"
            width="50%"
            height="300px"
         />
      </div>
   );
}
