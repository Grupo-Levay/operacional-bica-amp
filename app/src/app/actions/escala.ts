'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentCasa } from '@/lib/tenant'

async function getAdminContext() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const casa = await getCurrentCasa()

  const { data: member } = await supabase
    .from('team_members')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  const isAdmin = member?.role === 'admin'
  return { supabase, casa, isAdmin }
}

export async function confirmarPresenca(
  escalaId: string,
  confirmado: boolean
): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const casa = await getCurrentCasa()

  const { data: entrada } = await supabase
    .from('escala')
    .select('id')
    .eq('id', escalaId)
    .eq('casa', casa)
    .maybeSingle()

  if (!entrada) return

  await supabase
    .from('escala')
    .update({ confirmado })
    .eq('id', escalaId)

  revalidatePath('/escala')
}

export type Turno = 'abertura' | 'fechamento' | 'manha' | 'tarde' | 'noite' | 'integral'

export async function criarEntradaEscala(
  membroId: string,
  data: string,
  turno: Turno
): Promise<{ error?: string }> {
  const { supabase, casa, isAdmin } = await getAdminContext()
  if (!isAdmin) return { error: 'Sem permissão' }

  // evita duplicata
  const { data: existente } = await supabase
    .from('escala')
    .select('id')
    .eq('membro_id', membroId)
    .eq('data', data)
    .eq('casa', casa)
    .maybeSingle()

  if (existente) return { error: 'Entrada já existe para este dia' }

  const { error } = await supabase.from('escala').insert({
    membro_id: membroId,
    data,
    turno,
    casa,
    confirmado: false,
  })

  if (error) return { error: error.message }
  revalidatePath('/escala')
  return {}
}

export async function removerEntradaEscala(
  escalaId: string
): Promise<{ error?: string }> {
  const { supabase, casa, isAdmin } = await getAdminContext()
  if (!isAdmin) return { error: 'Sem permissão' }

  const { data: entrada } = await supabase
    .from('escala')
    .select('id')
    .eq('id', escalaId)
    .eq('casa', casa)
    .maybeSingle()

  if (!entrada) return { error: 'Entrada não encontrada' }

  const { error } = await supabase.from('escala').delete().eq('id', escalaId)
  if (error) return { error: error.message }

  revalidatePath('/escala')
  return {}
}
