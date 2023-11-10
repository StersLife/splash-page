const { default: axios } = require("axios");

 async function fetchAccessToken(clientId ='9a39f9d2-4f52-44ef-b032-d050ffd5decd', clientSecret = 'kRr5PoihPxzaNP84gsLNqnMuQuO0koUQFRly18ol' ) {
  const tokenUrl = "https://auth.hospitable.com/oauth/token";

  const requestData = {
    client_id: clientId,
    client_secret: clientSecret,
    audience: "api.hospitable.com",
    grant_type: "client_credentials"
  };
  
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  try {
    const response = await axios.post(tokenUrl, requestData, config);
  
    if (response.status !== 200) {
      throw new Error("Token request failed");
    }
  
    const tokenData = response.data;
    return tokenData.access_token;
  } catch (error) {
    console.error(error);
    throw error
  }
  }

  module.exports = fetchAccessToken