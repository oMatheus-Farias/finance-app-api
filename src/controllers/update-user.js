import { UpdateUserUseCase } from '../use-case/update-user.js'
import validator from 'validator'

import { badRequest, ok, serverError } from './helpers.js'

import { EmailAlreadyInUseError } from '../errors/user.js'

export class UpdateUserController {
  async execute(httpRequest) {
    try {
      const userId = httpRequest.params.userId

      const isIdValid = validator.isUUID(userId)

      if (!isIdValid) {
        return badRequest({
          message: 'The provided id id not valid. Please provide a valid id.',
        })
      }

      const updateUserParams = httpRequest.body

      const allowedFields = ['first_name', 'last_name', 'email', 'password']

      const someFieldIsNotAllowed = Object.keys(updateUserParams).some(
        (field) => !allowedFields.includes(field),
      )

      if (someFieldIsNotAllowed) {
        return badRequest({
          message: 'Some provide field is not allowed.',
        })
      }

      if (updateUserParams.password) {
        const passwordIsInvalid = updateUserParams.password.length < 6

        if (passwordIsInvalid) {
          return badRequest({
            message: 'Password must have at least 6 characters',
          })
        }
      }

      if (updateUserParams.email) {
        const emailIsValid = validator.isEmail(updateUserParams.email)

        if (!emailIsValid) {
          return badRequest({
            message: 'Invalid e-mail. Please provide a valid one.',
          })
        }
      }

      const updateUserUseCase = new UpdateUserUseCase()

      const updatedUser = await updateUserUseCase.execute(
        userId,
        updateUserParams,
      )

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
