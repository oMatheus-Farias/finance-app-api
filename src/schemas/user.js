import { z } from 'zod'

export const createUserSquema = z.object({
  first_name: z
    .string({
      required_error: 'First name is required.',
    })
    .trim()
    .min(1, {
      message: 'First name is required.',
    }),
  last_name: z
    .string({
      required_error: 'Last name is required.',
    })
    .trim()
    .min(1, {
      message: 'Last name is required.',
    }),
  email: z
    .string({
      required_error: 'Email is required.',
    })
    .email({
      message: 'Please provide a valid email address.',
    })
    .trim()
    .min(1, {
      message: 'Email is required.',
    }),
  password: z
    .string({
      required_error: 'Password is required.',
    })
    .trim()
    .min(6, {
      message: 'Password must have at least 6 characters',
    }),
})

export const updateUserSquema = createUserSquema.partial().strict({
  message: 'Some provided fields are not allowed.',
})
