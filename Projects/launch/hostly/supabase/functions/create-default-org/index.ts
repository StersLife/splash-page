// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js"

Deno.serve(async (req) => {
  try {
    const { record } = await req.json()
    const userId = record.id
    const email = record.email

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    )

    // Insert user
    const { error: userError } = await supabase
      .from("users")
      .insert({ id: userId, email })
    if (userError) throw userError

    // Create org
    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .insert({ name: "My Org", owner_id: userId })
      .select()
      .single()
    if (orgError) throw orgError

    // Add to org_members
    const { error: memberError } = await supabase
      .from("org_members")
      .insert({ user_id: userId, org_id: org.id, role: "owner" })
    if (memberError) throw memberError

    return new Response("User + Org created ✅", { status: 200 })
  } catch (err) {
    console.error("[Edge Function Error]", err)
    return new Response("Something went wrong ❌", { status: 500 })
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/create-default-org' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
