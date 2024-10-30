'use client'
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { formatPhoneNumber, getStatusMessage, validateField } from '@/utils/authUtils';
import { useDisclosure } from '@/hooks/useDisclosure';
import AuthDialoge from '@/components/shared/AuthDialoge';
import { useAuth } from '@/hooks/useAuth';
import { createClient } from '@/utils/supabase/client';

const SignupForm = ({
  handleModeSwitch,
  createRevenueReport
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    terms: false
  });
  const [status, setStatus] = useState(null)
  const {signUp, loading, setLoading,  error } = useAuth();
  
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const supabase =createClient()
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'phone') {
      const formattedPhone = formatPhoneNumber(value);
      setFormData(prev => ({ ...prev, [name]: formattedPhone }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, formData[name], setErrors);
  };

 

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (loading) return;

  // Mark all fields as touched
  const allFields = Object.keys(formData);
  const newTouched = allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {});
  setTouched(newTouched);

  // Validate all fields
  const newErrors = {};
  let isValid = true;
  Object.entries(formData).forEach(([field, value]) => {
    if (!validateField(field, value, setErrors)) {
      isValid = false;
      newErrors[field] = errors[field];
    }
  });

  if (!isValid) {
    // Scroll to the first error
    const firstErrorField = document.querySelector('.error-field');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  try {
    setLoading(true);

    // Check if user already exists and their verification status
    const { data: existingUser } = await supabase
      .from('users')
      .select('email, email_verified')
      .eq('email', formData.email)
      .single();

    if (existingUser) {
      if (existingUser.email_verified) {
        // User exists and is verified
        setStatus('exists_verified');
      } else {
        // User exists but hasn't verified their email! Send email again
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: existingUser.email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/verify`
          }
        });

        if (error) throw error;

        setStatus('exists_unverified');
      }
      return;
    }

    await signUp(formData);
    createRevenueReport(formData.email)
    if (error) throw error;

    setStatus('success');
    console.log('Form submitted successfully:', formData);

  } catch (error) {
    console.error('Error during signup:', error.message);
    setStatus('error');
  } finally {
    setLoading(false);
  }
};

  const getInputClassName = (fieldName) => `
    w-full px-4 py-2 rounded-lg border 
    ${touched[fieldName] && errors[fieldName] ? 'border-red-500 bg-red-50' : 'border-gray-300'} 
    focus:outline-none focus:ring-2 
    ${touched[fieldName] && errors[fieldName] ? 'focus:ring-red-500' : 'focus:ring-blue-500'}
    transition-all duration-200
  `;

  return (
           <div className="  py-6 bg-white rounded-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Sign up</h2>
        <p className="text-gray-600">Get unlimited access to all our properties.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="firstName"
            placeholder="First name"
            value={formData.firstName}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`${getInputClassName('firstName')} error-field`}
          />
          {touched.firstName && errors.firstName && (
            <p className="mt-1 text-sm text-red-500 animate-fadeIn">{errors.firstName}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            name="lastName"
            placeholder="Last name"
            value={formData.lastName}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`${getInputClassName('lastName')} error-field`}
          />
          {touched.lastName && errors.lastName && (
            <p className="mt-1 text-sm text-red-500 animate-fadeIn">{errors.lastName}</p>
          )}
        </div>

        <div>
          <div className={`flex items-center border rounded-lg px-4 py-2 bg-white
            ${touched.phone && errors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}>
            <span className="mr-2">🇺🇸</span>
            <input
              type="tel"
              name="phone"
              placeholder="(201) 555-0123"
              value={formData.phone}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={`w-full focus:outline-none ${touched.phone && errors.phone ? 'text-red-500' : ''} error-field`}
            />
          </div>
          {touched.phone && errors.phone && (
            <p className="mt-1 text-sm text-red-500 animate-fadeIn">{errors.phone}</p>
          )}
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`${getInputClassName('email')} error-field`}
          />
          {touched.email && errors.email && (
            <p className="mt-1 text-sm text-red-500 animate-fadeIn">{errors.email}</p>
          )}
        </div>

        <div>
        <div  className="relative">

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`${getInputClassName('password')} error-field`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
          {touched.password && errors.password && (
            <p className="mt-1 text-sm text-red-500 animate-fadeIn">{errors.password}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Must contain 8 characters, 1 capital letter and 1 number
          </p>
        </div>

        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            name="terms"
            checked={formData.terms}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`mt-1 ${touched.terms && errors.terms ? 'border-red-500' : ''}`}
          />
          <label className="text-sm">
            I agree to Awning ss{' '}
            <a href="#" className="text-green-500 hover:underline">
              Terms and Conditions
            </a>
          </label>
        </div>
        {touched.terms && errors.terms && (
          <p className="text-sm text-red-500 animate-fadeIn">{errors.terms}</p>
        )}
        {
          status   && <p className="text-sm text-green-500">{getStatusMessage(status)}</p>
        }
        {
          error && <p className="text-sm text-red-500">{error}</p>
        }

        <button
          type="submit"
          className={`w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors ${loading && 'cursor-not-allowed bg-gray-300' } `}
        >
    {
      loading ? 'Loading...' : 'Create account'
    }
          </button>

        <p className="text-center text-sm">
          Already have an account?{' '}
          <button onClick={handleModeSwitch} className="text-green-500 hover:underline">
            Sign in
          </button>
        </p>
      </form>
    </div>
 
  );
};

export default SignupForm;