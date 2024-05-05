import axios from 'axios'

export const fetchAllReviews = async (propertyId) => {
  console.log(propertyId)
    const options = {
      method: 'GET',
      url: 'https://airbnb45.p.rapidapi.com/api/v1/getPropertyReviews',
      params: {
        propertyId,
        page: '1'
      },
      headers: {
        'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
        'X-RapidAPI-Host': process.env.REACT_APP_RAPID_API_HOST
      }
    };
  
    try {
      const response = await axios.request(options);
      // Handle successful response here (e.g., return response.data)
      console.log(response.data)
      return response.data;
    } catch (error) {
      // Handle errors here
      console.error('Error fetching reviews:', error);
  
       throw new Error('Error fetching reviews')
    }
  };