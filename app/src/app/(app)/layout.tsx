import { BottomNav } from "@/components/layout/bottom-nav"
import { CasaSwitcher } from "@/components/layout/casa-switcher"
import { LogoutBtn } from "@/components/layout/logout-btn"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-12 items-center justify-end gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <CasaSwitcher />
        <LogoutBtn />
      </header>
      <main className="flex-1 pb-20">{children}</main>
      <BottomNav />
    </div>
  )
}
