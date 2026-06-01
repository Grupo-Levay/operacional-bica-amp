import { Skeleton } from "@/components/ui/skeleton"

export default function ChecklistDetailLoading() {
  return (
    <main className="p-4 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-28" />
      </div>

      <Skeleton className="h-2 w-full rounded-full" />

      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-xl" />
        ))}
      </div>
    </main>
  )
}
