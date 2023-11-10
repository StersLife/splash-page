import axios from 'axios';

export const importPropertiesFromHospitable = async (accessToken) => {
    try {
        const response = await axios.get('https://api.hospitable.com/properties?per_page=2147483647', {
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          }
        });
    
        // Handle the response data here
        return response.data
      } catch (error) {
        // Handle any errors here
        console.error(error);
      }

}

export const importPropertyFromHospitable = async (accessToken, propertyId) => {
  try {
    const response = await axios.get(`https://api.hospitable.com/properties/${propertyId}`, {
      headers: {
        accept: 'application/json',
        'Authorization': `Bearer ${accessToken}`

      }
    });

    return response.data
  } catch (error) {
    console.error('Error:', error);
  }
}