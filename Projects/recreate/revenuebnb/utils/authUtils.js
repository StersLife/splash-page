const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    return phoneRegex.test(phone);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[0-9]/.test(password);
  };

  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 0) return '';
    if (numbers.length <= 3) return `(${numbers}`;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const validateField = (name, value, setErrors) => {
    let error = '';
    switch (name) {
      case 'firstName':
        if (!value.trim()) error = 'First name is required';
        break;
      case 'lastName':
        if (!value.trim()) error = 'Last name is required';
        break;
      case 'phone':
        if (!validatePhoneNumber(value)) error = 'Please enter a valid US phone number';
        break;
      case 'email':
        if (!validateEmail(value)) error = 'Please enter a valid email';
        break;
      case 'password':
        if (!validatePassword(value)) {
          error = 'Password must have 8+ characters, 1 capital letter, and 1 number';
        }
        break;
      case 'terms':
        if (!value) error = 'You must accept the terms and conditions';
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    return !error;
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'exists_verified':
        return "This email is already registered. Please sign in instead.";
      case 'exists_unverified':
        return "We sent you a verification email earlier. Please check your inbox and verify your email to continue.";
      case 'success':
        return "Please check your email to verify your account.";
      case 'error':
        return "Something went wrong. Please try again.";
      default:
        return "";
    }
  };

  export {
    validatePhoneNumber,
    validateEmail,
    validatePassword,
    formatPhoneNumber,
    validateField,
    getStatusMessage
  }