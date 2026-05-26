import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <main className="space-y-6 p-4">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-40" />
      </div>

      <div className="grid auto-rows-[minmax(108px,auto)] grid-cols-2 gap-3 md:grid-cols-4">
        <Skeleton className="col-span-2 h-[108px] rounded-xl" />
        <Skeleton className="h-[108px] rounded-xl" />
        <Skeleton className="h-[108px] rounded-xl" />
        <Skeleton className="h-[108px] rounded-xl" />
        <Skeleton className="h-[108px] rounded-xl" />
        <Skeleton className="col-span-2 h-[108px] rounded-xl" />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Skeleton className="h-52 rounded-xl" />
        <Skeleton className="h-52 rounded-xl" />
      </div>
    </main>
  )
}
