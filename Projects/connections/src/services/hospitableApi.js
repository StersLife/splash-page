export async function fetchAccessToken(clientId='9a39f9d2-4f52-44ef-b032-d050ffd5decd', clientSecret='kRr5PoihPxzaNP84gsLNqnMuQuO0koUQFRly18ol' ) {
    const tokenUrl = "https://auth.hospitable.com/oauth/token";
  
    const requestData = {
      client_id: clientId,
      client_secret: clientSecret,
      audience: "api.hospitable.com",
      grant_type: "client_credentials"
    };
  
    try {
      const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
      });
  
      if (!response.ok) {
        throw new Error("Token request failed");
      }
  
      const tokenData = await response.json();
      return tokenData.access_token;
    } catch (error) {
      // Handle errors, such as network issues or invalid credentials
      console.error("Error fetching access token:", error);
      throw error;
    }
}