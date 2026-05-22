# Task: Create Service

## When to use
When creating a new service module (data fetching, business logic, integration).

## Pattern

Services live in `app/src/lib/` or `app/src/actions/` depending on type:

| Type | Location | Pattern |
|------|----------|---------|
| Server action (mutations) | `app/src/actions/{domain}.ts` | `'use server'` |
| Data fetching utility | `app/src/lib/{domain}.ts` | Pure functions |
| Supabase queries | `app/src/lib/supabase/{domain}.ts` | Use supabase client |

## Steps

1. **Determine service type** based on what it does

2. **Create the file** with correct location and pattern

3. **Define the interface first**:
   ```typescript
   export type {ServiceName}Input = { ... }
   export type {ServiceName}Result = { ... }
   ```

4. **Implement functions** with explicit TypeScript types

5. **Write tests** in `app/src/lib/__tests__/` or next to the file

6. **Export from index** if the domain has a barrel file

## For Supabase services
```typescript
import { createClient } from '@/lib/supabase/server'

export async function get{Entity}(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('{table}')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}
```
