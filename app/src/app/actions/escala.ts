'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentCasa } from '@/lib/tenant'

export async function confirmarPresenca(
  escalaId: string,
  confirmado: boolean
): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const casa = await getCurrentCasa()

  // valida que a entrada de escala pertence à esta casa
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
