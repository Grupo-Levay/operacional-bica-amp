import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/shared/page-header"

export default function ChecklistsLoading() {
  return (
    <main className="p-4 space-y-6">
      <PageHeader title="Checklists" />

      {[0, 1].map((section) => (
        <section key={section} className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <div className="space-y-3">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
        </section>
      ))}
    </main>
  )
}
