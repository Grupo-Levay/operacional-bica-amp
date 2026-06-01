import { z } from 'zod'

/**
 * Schemas de validação de input das actions de auth.
 * Padrão de referência para adoção incremental de Zod nas demais actions.
 */

export const emailSchema = z.string().trim().email('Informe um e-mail válido.')

export const credentialsSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Informe a senha.'),
})

export const passwordUpdateSchema = z
  .object({
    password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.'),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'As senhas não coincidem.',
    path: ['confirm'],
  })
