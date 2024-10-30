'use client'

import { createClient } from '@/utils/supabase/client'
import { useState, useCallback } from 'react'
 
export const useAuth = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)
  const supabase = createClient()


  const signUp = useCallback(async (userData) => {
    console.log({
      userData
    })
    try {
      setLoading(true)
      setError(null)
      
      const { data, error: signUpError } = await supabase.auth.signUp({
  email: userData.email,
  password: userData.password,
  options: {
    data: {
      display_name: `${userData.firstName} ${userData.lastName}`,
      phone_number: userData.phone
    },
    emailRedirectTo: `${window.location.origin}/auth/verify`
  }
})

      if (signUpError) throw new Error(signUpError.message)
      // create user data
    const { error: userInsertError } = await supabase.from('users').insert([
      {
        id: data.user.id,
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        display_name: `${userData.firstName} ${userData.lastName}`,
        phone: userData.phone
      }
    ])

    if(userInsertError) throw new Error(userInsertError.message)

      
      return { data, error: null }
    } catch (err) {
      console.log({
        error: error.message
      })
      setError(err.message)
      return { data: null, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const signIn = useCallback(async (email, password) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw new Error(signInError.message)

      return { data, error: null }
    } catch (err) {
      setError(err?.message)
      return { data: null, error: err?.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw new Error(signOutError.message)

      return { error: null }
    } catch (err) {
      setError(err.message)
      return { error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    setLoading,
    error,
    setError,
    user,
    signUp,
    signIn,
    signOut,
  }
}