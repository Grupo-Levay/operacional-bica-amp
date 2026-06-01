import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { PageHeader } from "@/components/shared/page-header"

export default function EscalaLoading() {
  return (
    <main className="p-4 space-y-4">
      <PageHeader title="Escala" />

      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="space-y-2">
          {/* Cabeçalho de dias */}
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-8 rounded-md" />
            ))}
          </div>
          {/* Linhas de membros */}
          {Array.from({ length: 5 }).map((_, row) => (
            <div key={row} className="grid grid-cols-7 gap-2">
              {Array.from({ length: 7 }).map((_, col) => (
                <Skeleton key={col} className="h-12 rounded-md" />
              ))}
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  )
}
