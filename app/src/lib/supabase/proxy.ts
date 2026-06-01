import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(
  request: NextRequest,
  extraHeaders?: Record<string, string>
) {
  // Propaga headers extras (ex: x-pathname) ao request para que Server
  // Components possam lê-los via next/headers — usado pelo route guard de role.
  const requestHeaders = new Headers(request.headers)
  if (extraHeaders) {
    for (const [name, value] of Object.entries(extraHeaders)) {
      requestHeaders.set(name, value)
    }
  }

  let supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // getUser() valida com o servidor Auth — não usar getSession() para auth decisions
  const { data: { user } } = await supabase.auth.getUser()

  return { supabaseResponse, user }
}
