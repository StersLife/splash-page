// authService.js

import { createClient } from "@/utils/supabase/client"



export async function handleVerifiedUser(sessionUser) {
  if (!sessionUser || !sessionUser.email_confirmed_at) return
  const supabase = createClient()
console.log({
  sessionUser
})
  try {
    // Check if user already exists in main database
    const { data: existingUser, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', sessionUser.id)

    if (error) {
      console.error('Error checking existing user:', error)
      return
    }
    console.log({
      existingUser
    })

    if (!existingUser || existingUser.length === 0) {
      // Access `user_metadata` and insert additional fields into the main database
      const { display_name, phone_number } = sessionUser.user_metadata

      const { error: insertError } = await supabase
        .from('users')
        .insert([{
          id: sessionUser.id,
          email: sessionUser.email,
          display_name,
          first_name: display_name.split(' ')[0] || '',
          last_name: display_name.split(' ')[1] || '',
          phone: phone_number || '',
        }])

      if (insertError) {
        console.error('Error inserting user into database:', insertError)
      } else {
        console.log('User inserted into database:', sessionUser.email)
      }
    }
  } catch (err) {
    console.error('Error handling verified user:', err)
  }
}
