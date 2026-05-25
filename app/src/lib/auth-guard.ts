import { createClient } from "@/lib/supabase/server"
import { getCurrentCasa } from "@/lib/tenant"
import type { Casa } from "@/lib/tenant-types"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database.types"

type AppClient = SupabaseClient<Database>

/**
 * Guarda padrão das server actions: garante usuário autenticado e resolve a
 * casa atual no servidor (nunca confiar em casa vinda do cliente).
 */
export async function requireUser(): Promise<{
  supabase: AppClient
  userId: string
  casa: Casa
}> {
  const supabase = (await createClient()) as AppClient
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Não autenticado")
  const casa = await getCurrentCasa()
  return { supabase, userId: user.id, casa }
}
