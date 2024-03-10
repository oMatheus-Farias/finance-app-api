import { UpdateUserUseCase } from '../use-case/update-user.js'

import { badRequest, ok, serverError } from './helpers/http.js'
import { EmailAlreadyInUseError } from '../errors/user.js'

import {
  emailAlreadyInUseResponse,
  invalidPasswordResponse,
  invalidIdResponse,
  checkIfPasswordIsInvalid,
  checkIfEmailIsInvalid,
  checkIfIdIsValid,
} from './helpers/user.js'

export class UpdateUserController {
  async execute(httpRequest) {
    try {
      const userId = httpRequest.params.userId

      const isIdValid = checkIfIdIsValid(userId)

      if (!isIdValid) {
        return invalidIdResponse()
      }

      const params = httpRequest.body

      const allowedFields = ['first_name', 'last_name', 'email', 'password']

      const someFieldIsNotAllowed = Object.keys(params).some(
        (field) => !allowedFields.includes(field),
      )

      if (someFieldIsNotAllowed) {
        return badRequest({
          message: 'Some provide field is not allowed.',
        })
      }

      if (params.password) {
        const passwordIsInvalid = checkIfPasswordIsInvalid(params.password)

        if (passwordIsInvalid) {
          return invalidPasswordResponse()
        }
      }

      if (params.email) {
        const emailIsValid = checkIfEmailIsInvalid(params.email)

        if (!emailIsValid) {
          return emailAlreadyInUseResponse()
        }
      }

      const updateUserUseCase = new UpdateUserUseCase()

      const updatedUser = await updateUserUseCase.execute(userId, params)

      return ok(updatedUser)
    } catch (error) {
      if (error instanceof EmailAlreadyInUseError) {
        return badRequest({
          message: error.message,
        })
      }

      console.log(error)
      return serverError()
    }
  }
}
