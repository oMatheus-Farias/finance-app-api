import validator from 'validator'

import { GetUserByIdUseCase } from '../use-case/get-user-by-id.js'
import { ok, badRequest, serverError } from './helpers.js'

export class GetUserByIdController {
  async execute(httpRequest) {
    try {
      const isIdValid = validator.isUUID(httpRequest.params.userId)

      if (!isIdValid) {
        return badRequest({
          message: 'The provided id id not valid. Please provide a valid id.',
        })
      }

      const getUserByIdUseCase = new GetUserByIdUseCase()

      const user = await getUserByIdUseCase.execute(httpRequest.params.userId)

      return ok(user)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
