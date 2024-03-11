import { EmailAlreadyInUseError } from '../../errors/user.js'
import {
  emailAlreadyInUseResponse,
  invalidPasswordResponse,
  checkIfPasswordIsInvalid,
  checkIfEmailIsInvalid,
  badRequest,
  created,
  serverError,
  validateRequiredFields,
  requiredFieldIsMissingResponse,
} from '../helpers/index.js'

export class CreateUserController {
  constructor(createUserUseCase) {
    this.createUserUseCase = createUserUseCase
  }

  async execute(httpRequest) {
    try {
      const params = httpRequest.body

      const requiredFields = ['first_name', 'last_name', 'email', 'password']

      const { ok: requiredFieldWereProvided, missingField } =
        validateRequiredFields(params, requiredFields)

      if (!requiredFieldWereProvided) {
        return requiredFieldIsMissingResponse(missingField)
      }

      const passwordIsInvalid = checkIfPasswordIsInvalid(params.password)

      if (passwordIsInvalid) {
        return invalidPasswordResponse()
      }

      const emailIsValid = checkIfEmailIsInvalid(params.email)

      if (!emailIsValid) {
        return emailAlreadyInUseResponse()
      }

      const createdUser = await this.createUserUseCase.execute(params)

      return created(createdUser)
    } catch (error) {
      if (error instanceof EmailAlreadyInUseError) {
        return badRequest({ message: error.message })
      }

      console.error(error)
      return serverError()
    }
  }
}
