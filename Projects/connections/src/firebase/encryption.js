import CryptoJS from 'crypto-js'
export let encrtpyData = (apiKey) => {
    const encryptedApiKey = CryptoJS.AES.encrypt(apiKey, process.env.REACT_APP_API_ENCRYPT_SECRET).toString();
    return encryptedApiKey

  }
  export let decryptData = (encryptedData) => {
    const decryptedData = CryptoJS.AES.decrypt(encryptedData, process.env.REACT_APP_API_ENCRYPT_SECRET).toString(CryptoJS.enc.Utf8);
    return decryptedData

  }

