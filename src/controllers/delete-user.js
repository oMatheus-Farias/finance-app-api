import { DeleteUserUseCase } from '../use-cases/index.js'

import {
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  userNotFoundResponse,
  serverError,
} from './helpers/index.js'

export class DeleteUserController {
  async execute(httpRequest) {
    try {
      const isIdValid = checkIfIdIsValid(httpRequest.params.userId)

      if (!isIdValid) {
        return invalidIdResponse()
      }

      const deleteUserUseCase = new DeleteUserUseCase()

      const deletedUser = await deleteUserUseCase.execute(
        httpRequest.params.userId,
      )

      if (!deletedUser) {
        return userNotFoundResponse()
      }

      return ok(deletedUser)
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
