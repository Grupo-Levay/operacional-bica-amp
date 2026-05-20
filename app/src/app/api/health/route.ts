import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return NextResponse.json({
      status: 'error',
      message: 'Variáveis de ambiente ausentes',
      NEXT_PUBLIC_SUPABASE_URL: url ? 'definida' : 'AUSENTE',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: key ? 'definida' : 'AUSENTE',
    }, { status: 500 })
  }

  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const [checklists, estoque, equipe] = await Promise.all([
      supabase.from('checklists').select('id', { count: 'exact', head: true }),
      supabase.from('estoque_itens').select('id', { count: 'exact', head: true }),
      supabase.from('equipe').select('id', { count: 'exact', head: true }),
    ])

    return NextResponse.json({
      status: 'ok',
      supabase_url: url.replace(/\/\/.*@/, '//***@').substring(0, 40) + '...',
      counts: {
        checklists: checklists.error ? `ERRO: ${checklists.error.message}` : checklists.count,
        estoque: estoque.error ? `ERRO: ${estoque.error.message}` : estoque.count,
        equipe: equipe.error ? `ERRO: ${equipe.error.message}` : equipe.count,
      },
    })
  } catch (e) {
    return NextResponse.json({
      status: 'error',
      message: String(e),
    }, { status: 500 })
  }
}
