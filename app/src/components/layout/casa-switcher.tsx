import { getCurrentCasa, setCurrentCasa, CASA_LABELS, type Casa } from "@/lib/tenant"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

async function getUserCasas(): Promise<Casa[]> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return ["bica"]

    const { data } = await supabase
      .from("team_members")
      .select("casas")
      .eq("id", user.id)
      .single()

    const casas = data?.casas as Casa[] | null
    if (!casas || casas.length === 0) return ["bica"]
    return casas
  } catch {
    return ["bica"]
  }
}

async function switchCasa(formData: FormData) {
  "use server"
  const raw = formData.get("casa")
  if (raw !== "bica" && raw !== "amp") return
  await setCurrentCasa(raw)
  revalidatePath("/", "layout")
}

export async function CasaSwitcher() {
  const [userCasas, currentCasa] = await Promise.all([
    getUserCasas(),
    getCurrentCasa(),
  ])

  if (userCasas.length <= 1) return null

  const other = currentCasa === "bica" ? "amp" : "bica"

  return (
    <form action={switchCasa}>
      <input type="hidden" name="casa" value={other} />
      <button
        type="submit"
        className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors hover:bg-accent"
      >
        <span
          className="size-2 rounded-full"
          style={{
            backgroundColor:
              currentCasa === "bica"
                ? "var(--color-bica, #c4973a)"
                : "var(--color-amp, #c13b2a)",
          }}
        />
        {CASA_LABELS[currentCasa]}
      </button>
    </form>
  )
}
