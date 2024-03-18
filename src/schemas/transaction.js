import validator from 'validator'
import { z } from 'zod'

export const createTransactionSchema = z.object({
  user_id: z
    .string({
      message: 'User ID is required.',
    })
    .uuid({
      message: 'User ID must be a valid UUID.',
    }),
  name: z
    .string({
      message: 'Name is required.',
    })
    .trim()
    .min(1, {
      message: 'Name is required.',
    }),
  date: z
    .string({
      required_error: 'Date is required.',
    })
    .datetime({
      message: 'Date must be a valid date.',
    }),
  amount: z
    .number({
      required_error: 'Amount is required.',
      invalid_type_error: 'Amount must be a number.',
    })
    .min(1, {
      message: 'Amount must be greater than 0.',
    })
    .refine((value) =>
      validator.isCurrency(value.toFixed(2), {
        digits_after_decimal: [2],
        allow_negatives: false,
        decimal_separator: '.',
      }),
    ),
  type: z.enum(['EXPENSE', 'EARNING', 'INVESTMENT'], {
    errorMap: () => ({
      message: 'Type must be EXPENSE, EARNING or INVESTMENT.',
    }),
  }),
})

export const updateTransactionSchema = createTransactionSchema
  .omit({
    user_id: true,
  })
  .partial()
  .strict({
    message: 'Some provided field is not allowed.',
  })
