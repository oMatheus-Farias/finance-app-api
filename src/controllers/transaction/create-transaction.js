import {
  serverError,
  badRequest,
  checkIfIdIsValid,
  invalidIdResponse,
  created,
  validateRequiredFields,
  requiredFieldIsMissingResponse,
  checkIfAmountIsvalid,
  checkIfTypeIsValid,
  invalidAmoundResponse,
  invalidTypeResponse,
} from '../helpers/index.js'
import { UserNotFoundError } from '../../errors/user.js'

export class CreateTransactionController {
  constructor(createTransactionUseCase) {
    this.createTransactionUseCase = createTransactionUseCase
  }

  async execute(httpRequest) {
    try {
      const params = httpRequest.body

      const requiredFields = ['user_id', 'name', 'date', 'amount', 'type']

      const { ok: requiredFieldWereProvided, missingField } =
        validateRequiredFields(params, requiredFields)

      if (!requiredFieldWereProvided) {
        return requiredFieldIsMissingResponse(missingField)
      }

      const idIsValid = checkIfIdIsValid(params.user_id)

      if (!idIsValid) {
        return invalidIdResponse()
      }

      const amountIsValid = checkIfAmountIsvalid(params.amount)

      if (!amountIsValid) {
        return invalidAmoundResponse()
      }

      const type = params.type.trim().toUpperCase()

      const typesIsValid = checkIfTypeIsValid(type)

      if (!typesIsValid) {
        return invalidTypeResponse()
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
