'use client'
import { useUser } from '@/context/authContext'
import { useAuth } from '@/hooks/useAuth'
import React from 'react'

const AuthButton = () => {
    const { user} = useUser()
   const { signOut } = useAuth()

    if (!user) return;

  return (
    <button
      onClick={signOut}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
    >
      Sign Out
    </button>
  )
}

export default AuthButton