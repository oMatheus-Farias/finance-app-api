import {
  checkIfIdIsValid,
  invalidIdResponse,
  ok,
  userNotFoundResponse,
  serverError,
} from '../helpers/index.js'

export class DeleteUserController {
  constructor(deleteUserUseCase) {
    this.deleteUserUseCase = deleteUserUseCase
  }

  async execute(httpRequest) {
    try {
      const isIdValid = checkIfIdIsValid(httpRequest.params.userId)

      if (!isIdValid) {
        return invalidIdResponse()
      }

      const deletedUser = await this.deleteUserUseCase.execute(
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
