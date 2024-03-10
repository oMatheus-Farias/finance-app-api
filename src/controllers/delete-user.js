import { DeleteUserUseCase } from '../use-cases/index.js'

import {
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  serverError,
} from './helpers/index.js'

export class DeleteUserController {
  async execute(httpRequest) {
    try {
      const isIdValid = checkIfIdIsValid(httpRequest.params.userId)

      if (!isIdValid) {
        invalidIdResponse()
      }

      const deleteUserUseCase = new DeleteUserUseCase()

      const deletedUser = await deleteUserUseCase.execute(
        httpRequest.params.userId,
      )

      return ok(deletedUser)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
