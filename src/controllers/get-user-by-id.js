import validator from 'validator'

import { GetUserByIdUseCase } from '../use-case/get-user-by-id.js'
import { ok, notFound, serverError } from './helpers/http.js'
import { invalidIdResponse } from './helpers/user.js'

export class GetUserByIdController {
  async execute(httpRequest) {
    try {
      const isIdValid = validator.isUUID(httpRequest.params.userId)

      if (!isIdValid) {
        invalidIdResponse()
      }

      const getUserByIdUseCase = new GetUserByIdUseCase()

      const user = await getUserByIdUseCase.execute(httpRequest.params.userId)

      if (!user) {
        return notFound({
          message: 'User not found.',
        })
      }

      return ok(user)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
