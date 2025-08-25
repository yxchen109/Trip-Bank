import { z } from 'zod'

export const signUpFormSchema = z
    .object({
        username: z.string()
            .min(3, { message: "帳號至少3個字符" })
            .max(20, { message: "帳號最長20個字符" }),
        email: z.string().email({ message: "無效的電子郵件" }),
        password: z.string()
            .min(8, { message: "密碼至少要8個字符" })
            .max(20, { message: "密碼最長20個字符" }),
        password2: z.string()
            .min(8, { message: "確認密碼至少要8個字符" })
            .max(20, { message: "確認密碼最長20個字符" }),
    })
    .refine((data) => data.password === data.password2, {
        message: "密碼不匹配",
        path: ["password2"],
    });

export type SignUpFormSchemaType = z.infer<typeof signUpFormSchema>