'use client'
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { validateEmail } from '@/utils/authUtils';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

const SignInForm = ({
  handleModeSwitch,
  createRevenueReport
}) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState(null);

  const { signIn, loading, error, setError } = useAuth();
  const supabase = createClient();

  const handleResendVerification = async () => {
    try {
      setResendLoading(true);
      setResendError(null);

      const { error: resendErr } = await supabase.auth.resend({
        type: 'signup',
        email: formData.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify`
        }
      });

      if (resendErr) throw new Error(resendErr.message);
      
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000); // Reset success message after 5 seconds
    } catch (err) {
      setResendError(err.message);
    } finally {
      setResendLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (touched[name]) {
      validateField(name, type === 'checkbox' ? checked : value);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!validateEmail(value)) {
          error = 'Please enter a valid email';
        }
        break;
      case 'password':
        if (!value.trim()) {
          error = 'Password is required';
        }
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    return !error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(loading) return;
    
    const allFields = ['email', 'password'];
    const newTouched = allFields.reduce((acc, field) => ({
      ...acc,
      [field]: true
    }), {});
    setTouched(newTouched);

    let isValid = true;
    allFields.forEach(field => {
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
    });

    if (isValid) {
      const response = await signIn(formData.email, formData.password);
      if(createRevenueReport && response.data && !response.error){
        console.log('Sign in successful');
        const report = await createRevenueReport(formData.email);
        router.push(`/revenue-report/${report.id}`);
      }
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
    <div className="py-6 bg-white rounded-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Sign in</h2>
        <p className="text-gray-600">Welcome back! Please enter your details.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={getInputClassName('email')}
          />
          {touched.email && errors.email && (
            <p className="mt-1 text-sm text-red-500 animate-fadeIn">{errors.email}</p>
          )}
        </div>

        <div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              onBlur={handleBlur}
              className={getInputClassName('password')}
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
        </div>

        {error && (
          <div className="space-y-2">
            <p className="text-sm text-red-500">
              {error === 'Email not confirmed' ? 'Email is not verified' : error}
            </p>
            {error === 'Email not confirmed' && (
              <>
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resendLoading}
                  className={`w-full py-2 px-4 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${resendLoading && 'cursor-not-allowed bg-blue-400'}`}
                >
                  {resendLoading ? 'Sending...' : 'Resend verification email'}
                </button>
                {resendError && (
                  <p className="text-sm text-red-500 animate-fadeIn">
                    Failed to resend: {resendError}
                  </p>
                )}
                {resendSuccess && (
                  <p className="text-sm text-green-500 animate-fadeIn">
                    Verification email sent successfully!
                  </p>
                )}
              </>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label className="text-sm text-gray-600">Remember me</label>
          </div>
          <a href="#" className="text-sm text-green-500 hover:underline">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors ${loading && 'cursor-not-allowed bg-gray-400'}`}
        >
          {loading ? 'Loading...' : 'Sign in'}
        </button>

        <p className="text-center text-sm">
          Don`t have an account?{' '}
          <button onClick={handleModeSwitch} className="text-green-500 hover:underline">
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignInForm;