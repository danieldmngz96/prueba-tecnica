const token = 'BQDHPLg60WTaR7grFrIe44IlCvUlrtBmroCXOPDqQa-00_kncExUJyCb-E9Vh6sFXv69tWDWZPrT9UthpZ-bYlfJu_9mPvEokLhQhVunO1C0ENegbVg60xlIVFrTBfodkkaFP2iSCIm7mv32a8xQJ-usGldnOISUrn0R5PasMBCPhVTr4Z_OYSqGxXst1J8WXJx_HRN3UW_3ijBvQqp588s-PEwlhdtH1cdxJphmRQL6HSnP-kODqrLfobao_lpY2g';

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
