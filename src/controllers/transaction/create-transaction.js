import { serverError, badRequest, created } from '../helpers/index.js'
import { UserNotFoundError } from '../../errors/user.js'
import { createTransactionSchema } from '../../schemas/index.js'
import { ZodError } from 'zod'

export class CreateTransactionController {
  constructor(createTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase
  }

  async execute(httpRequest) {
    try {
      const params = httpRequest.body

      await createTransactionSchema.parseAsync(params)

      const createdTransaction =
        await this.createTransactionUseCase.execute(params)

      return created(createdTransaction)
    } catch (error) {
      if (error instanceof ZodError) {
        return badRequest({
          message: error.errors[0].message,
        })
      }

      if (error instanceof UserNotFoundError) {
        return badRequest({ message: error.message })
      }

      console.error(error)
      return serverError()
    }
  }
}
