import { BottomNav } from "@/components/layout/bottom-nav"
import { Sidebar } from "@/components/layout/sidebar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar — desktop only */}
      <Sidebar />

      {/* Conteúdo principal */}
      <div className="flex flex-col flex-1 md:pl-56">
        <main className="flex-1 pb-20 md:pb-8">{children}</main>
        {/* Bottom nav — mobile only */}
        <BottomNav />
      </div>
    </div>
  )
}
