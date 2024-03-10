import {
  serverError,
  badRequest,
  checkIfIdIsValid,
  invalidIdResponse,
  created,
} from '../helpers/index.js'
import { UserNotFoundError } from '../../errors/user.js'
import validator from 'validator'

export class CreateTransactionController {
  constructor(createTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase
  }

  async execute(httpRequest) {
    try {
      const params = httpRequest.body

      const requiredFields = ['id', 'user_id', 'name', 'date', 'amount', 'type']

      for (const field of requiredFields) {
        if (!params[field] || params[field].trim().length === 0) {
          return badRequest({ message: `Missing param: ${field}` })
        }
      }

      const idIsValid = checkIfIdIsValid(params.user_id)

      if (!idIsValid) {
        return invalidIdResponse()
      }

      if (params.amount <= 0) {
        return badRequest({ message: `Amount must be greater than 0.` })
      }

      const amountIsValid = validator.isCurrency(params.amount.toString(), {
        digits_after_decimal: [2],
        allow_negatives: false,
        decimal_separator: '.',
      })

      if (!amountIsValid) {
        return badRequest({ message: `Invalid amount.` })
      }

      const type = params.type.trim().toUpperCase()

      const typesIsValid = ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(type)

      if (!typesIsValid) {
        return badRequest({
          message: `The type must be EARNING, EXPENSE or INVESTMENT.`,
        })
      }

      const createdTransaction = await this.createTransactionUseCase.execute({
        ...params,
        type,
      })

      return created(createdTransaction)
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        return badRequest({ message: error.message })
      }

      console.error(error)
      return serverError()
    }
  }
}
