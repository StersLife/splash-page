
export function validateEmailAndPassword(email, password) {
    // Regular expression to validate email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  
    // Check email format

    
    if (!emailRegex.test(email)) {
      return { valid: false, message: 'Invalid email format' };
    }
  
    // Check password length
    if (password.length < 6) {
      return { valid: false, message: 'Password must be at least 6 characters long' };
    }
  
    // Both email and password are valid
    return { valid: true };
  }
  