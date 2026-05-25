export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-ink2"
    >
      {children}
    </div>
  )
}
