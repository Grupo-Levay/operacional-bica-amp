import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

const PUBLIC_PATHS = ['/login', '/cardapio']

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const isPublic = PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))
  const isAsset = /^\/(_next|favicon\.ico|.*\.(svg|png|jpg|jpeg|gif|webp|ico))/.test(pathname)

  if (isAsset) return NextResponse.next()

  const { supabaseResponse, user } = await updateSession(request)

  if (!isPublic && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (pathname === '/login' && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
