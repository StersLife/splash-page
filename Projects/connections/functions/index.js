const functions = require("firebase-functions");
const admin = require('firebase-admin');
const fetchAccessToken = require("./utils");
const { default: axios } = require("axios");


admin.initializeApp();

const firestore = admin.firestore();



   exports.fetchReservations = functions.https.onCall( async (data, context) => {

    // fetch reservations:
    try {

      const requestData = {
        date_query: 'checkin',
        properties: data.propertyIds,
      };
      const accessToken = await fetchAccessToken()
    
      const response = await axios.get('https://api.hospitable.com/calendar/reservations', {
        params: requestData, // Axios will serialize this object into query parameters
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      functions.logger.log(response.data)
      const reservations = response.data.data || [];
      const promises = [];

      reservations.forEach(reservation => {
        const ref = firestore.collection('reservations').doc();
        promises.push(ref.set(reservation))
      });

      const promiseFullFulling = await Promise.all(promises)

      
  

    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }


    
});