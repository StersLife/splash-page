'use client'
import AuthDialoge from '@/components/shared/AuthDialoge';
 import React, { useState } from 'react'
import SignInForm from './SigninForm';
import SignupForm from './SignupForm';

const AuthModeSwitcher = ({
    isOpen,
    onToggle,
    createRevenueReport
}) => {
    const [mode, setMode] = useState('signin');
    const handleModeSwitch = () => {
        setMode(mode === 'signin' ? 'signup' : 'signin');
    }
  return (
    <AuthDialoge isOpen={isOpen} onOpenChange={onToggle} label={mode === 'signin' ? 'Sign In' : 'Sign Up'}>
        {mode === 'signin' ? <SignInForm createRevenueReport={createRevenueReport}  handleModeSwitch={handleModeSwitch} /> : <SignupForm  createRevenueReport={createRevenueReport} handleModeSwitch={handleModeSwitch} />}
 
    </AuthDialoge>
  )
}

export default AuthModeSwitcher