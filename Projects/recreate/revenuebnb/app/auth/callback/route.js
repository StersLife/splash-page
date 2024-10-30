// app/api/auth/callback/route.js
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request) {
  try {
    console.log('🔥 Auth callback triggered')
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    console.log('📫 Verification code:', code ? 'Received' : 'Missing')
    
    if (code) {
      const cookieStore = await cookies()
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
      
      // First exchange the code for a session
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      console.log('🔄 Code exchange:', exchangeError ? 'Failed' : 'Success')
      
      if (exchangeError) {
        console.error('Code exchange failed:', exchangeError)
        throw new Error('Failed to exchange code')
      }

      // Now we can get the user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      console.log('👤 User data:', user || 'No user found')
      console.log('❌ User error:', userError || 'No error')
      
      if (userError || !user) {
        console.error('Failed to get user details:', userError)
        throw new Error('Failed to get user details')
      }

      // Only proceed if email is confirmed
      if (!user.email_confirmed_at) {
        console.log('📧 Email not confirmed yet')
        return NextResponse.redirect(new URL('/auth/pending', request.url))
      }

      // Check if user exists in database
      const { data: existingUser, error: existingUserError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
      
      console.log('🔍 Existing user check:', {
        exists: !!existingUser?.length,
        error: existingUserError
      })
      
      if (existingUserError) {
        console.error('Database query failed:', existingUserError)
        throw new Error('Database query failed')
      }
      
      if (!existingUser?.length) {
        console.log('📝 Creating new user record...')
        const { display_name, phone_number } = user.user_metadata || {}
        
        const { error: insertError } = await supabase
          .from('users')
          .insert([{
            id: user.id,
            email: user.email,
            display_name: display_name || '',
            first_name: display_name?.split(' ')[0] || '',
            last_name: display_name?.split(' ')[1] || '',
            phone: phone_number || '',
            created_at: new Date().toISOString(),
          }])
          
        if (insertError) {
          console.error('Failed to create user record:', insertError)
          throw new Error('Failed to create user record')
        }
        console.log('✅ User record created successfully')
      }
      
      console.log('🎯 Redirecting to success page')
      // Make sure to use absolute URL for redirect
      return NextResponse.redirect(new URL('/auth/success', request.url), {
        // Set status to 301 for permanent redirect
        status: 301
      })
    }
    
    console.error('No verification code provided')
    throw new Error('No code provided')
  } catch (error) {
    console.error('💥 Auth callback failed:', {
      error: error.message,
      stack: error.stack
    })
    
    // Make sure to use absolute URL for error redirect
    const errorUrl = new URL('/auth/error', request.url)
    errorUrl.searchParams.set('message', error.message)
    return NextResponse.redirect(errorUrl, {
      // Set status to 302 for temporary redirect
      status: 302
    })
  }
}