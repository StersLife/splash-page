
import axios from 'axios';
import {parse, stringify, toJSON, fromJSON} from 'flatted';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
    // Add other headers if needed
  },
});

export const makeApiCall = async (endpoint, data) => {
  try {
    const response = await api.post(endpoint, data);
     console.log(response.data)
    return parse(response.data.data)
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};