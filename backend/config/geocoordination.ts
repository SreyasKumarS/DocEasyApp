import axios from 'axios';

export async function getCoordinates(locality: string, email:string): Promise<{ latitude: number, longitude: number } | null> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(locality)}&format=json&limit=1`;

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': `DocEasy/${email}`, // Replace with your app's name and a valid email address
      }
    });

    if (response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    } else {
      throw new Error('Location not found');
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
}
