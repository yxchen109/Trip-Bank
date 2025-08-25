import { z } from 'zod'

export const signInFormSchema = z.object({
  email: z.string().email({ message: "無效的電子郵件" }),
  password: z.string()
    .min(8, { message: "密碼至少要8個字符" })
    .max(20, { message: "密碼最長20個字符" }),
})

export type SignInFormSchemaType = z.infer<typeof signInFormSchema>