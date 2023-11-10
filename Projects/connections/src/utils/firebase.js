export const mapFirebaseErrorToMessage = (errorCode, setError) => {
    switch (errorCode) {
        case 'auth/email-already-in-use':
            setError('The email address is already in use. Please use a different email or sign in.');
            break;
          case 'auth/invalid-email':
            setError('Invalid email format. Please enter a valid email address.');
            break;
          case 'auth/weak-password':
            setError('The password is too weak. Please use a stronger password.');
            break;
          case 'auth/user-disabled':
            setError('Your account has been disabled. Please contact support for assistance.');
            break;
          case 'auth/user-not-found':
            setError('No account found with this email. Please sign up or use a different email.');
            break;
          case 'auth/wrong-password':
            setError('Incorrect password. Please try again or reset your password.');
            break;
          case 'auth/invalid-login-credentials':
            setError('Invalid login credentials. Please double-check your email and password.');
            break;
          default:
            setError('An error occurred during login. Please try again later.');
        
    }
  };