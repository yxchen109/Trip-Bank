import { z } from 'zod'

export const signInFormSchema = z.object({
  email: z.string().email(
    { message: '無效的電子郵件' }
  ),
  password: z.string().min(6, {
    message: '密碼最短需要6個字符'
  })
})

export type SignInFormSchemaType = z.infer<typeof signInFormSchema>