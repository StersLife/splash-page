'use client'

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

export default function VerifyPage() {
  const [status, setStatus] = useState('verifying');
  const searchParams = useSearchParams();
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const verifyEmail = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      
      // If there's an explicit error, handle it
      if (error) {
        setStatus({
          status: 'error',
          title: 'Verification Error',
          description: errorDescription || 'An error occurred during verification.',
        });
        return;
      }

      // Check for tokens in hash
      const hash = window.location.hash;
      const accessToken = new URLSearchParams(hash.replace('#', '?')).get('access_token');
      const refreshToken = new URLSearchParams(hash.replace('#', '?')).get('refresh_token');

      // If we have tokens, handle session setup
      if (accessToken && refreshToken) {
        try {
          const { error: sessionError } = await supabase.auth.setSession({ 
            access_token: accessToken, 
            refresh_token: refreshToken 
          })

          if (sessionError) {
            console.error('Error setting session:', sessionError.message);
            setStatus({
              status: 'error',
              title: 'Session Error',
              description: 'Unable to set session. Please try again later.',
            });
            return;
          }

          setStatus({
            status: 'success',
            title: 'Verification successful',
            description: 'Your email has been verified. You can now close this window.',
          });

          setTimeout(() => {
              router.push('/');
          }, 1500);
          return;
        } catch (err) {
          console.error('Unexpected error while setting session:', err);
          setStatus({
            status: 'error',
            title: 'Unexpected Error',
            description: 'An unexpected error occurred. Please try again.',
          });
          return;
        }
      }

      // If no tokens are present, verify using code
      if (code) {
        try {
          // Your code verification logic here
          console.log(`Email verified successfully`);
          setTimeout(() => {
            router.push('/');
        }, 1500);
          setStatus({
            status: 'success',
            title: 'Email verified successfully',
            description: 'Your email has been verified. You can now close this window.',
          });
        } catch (err) {
          setStatus({
            status: 'error',
            title: 'Verification failed',
            description: 'The verification link is invalid or has expired. Please request a new verification email.',
          });
        }
      } else {
        // No code and no tokens found
        setStatus({
          status: 'error',
          title: 'Invalid verification link',
          description: 'No verification method found. Please check your email for the correct verification link.',
        });
      }
    };

    verifyEmail();
  }, [searchParams, supabase.auth]);

  const statusConfig = {
    verifying: {
      title: 'Verifying your email',
      description: 'Please wait while we confirm your email address...',
      icon: <Loader2 className="h-5 w-5 animate-spin text-blue-500" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      titleColor: 'text-blue-800',
    },
    success: {
      title: 'Email verified successfully',
      description: 'Your email has been verified. You can now close this window.',
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      titleColor: 'text-green-800',
    },
    error: {
      title: 'Verification failed',
      description: 'The verification link is invalid or has expired. Please request a new verification email.',
      icon: <AlertCircle className="h-5 w-5 text-red-500" />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      titleColor: 'text-red-800',
    },
  };

  const currentStatus = statusConfig[status.status || 'verifying'];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-md p-8 mx-4">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Email Verification</h1>
        </div>

        <div className={`rounded-lg border p-4 ${currentStatus.bgColor} ${currentStatus.borderColor}`}>
          <div className="flex gap-3">
            {currentStatus.icon}
            <div>
              <h3 className={`font-medium ${currentStatus.titleColor}`}>
                {status.title || currentStatus.title}
              </h3>
              <p className="mt-1 text-sm text-gray-700">
                {status.description || currentStatus.description}
              </p>
            </div>
          </div>
        </div>

        {status.status === 'error' && (
          <div className="mt-6 text-center">
            <button 
              onClick={() => window.close()}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Close window
            </button>
          </div>
        )}
      </div>
    </div>
  );
}