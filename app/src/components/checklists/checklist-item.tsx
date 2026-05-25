import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChecklistItemProps {
  item: string
  concluido: boolean
  onToggle: () => void
}

export function ChecklistItem({ item, concluido, onToggle }: ChecklistItemProps) {
  return (
    <li>
      <button
        type="button"
        role="checkbox"
        aria-checked={concluido}
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left bg-ink2 active:bg-ink4 transition-colors min-h-[52px]"
      >
        <span
          className={cn(
            'shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200',
            concluido ? 'border-primary bg-primary' : 'border-b3 bg-transparent',
          )}
        >
          <Check
            className={cn(
              'size-3.5 text-bica-fg transition-opacity duration-200',
              concluido ? 'opacity-100' : 'opacity-0',
            )}
            strokeWidth={3}
          />
        </span>
        <span
          className={cn(
            'text-sm flex-1 transition-all duration-200',
            concluido ? 'line-through text-b4' : 'text-b1',
          )}
        >
          {item}
        </span>
      </button>
    </li>
  )
}
