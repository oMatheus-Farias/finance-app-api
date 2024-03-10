import { GetUserByIdUseCase } from '../use-cases/index.js'
import {
  invalidIdResponse,
  checkIfIdIsValid,
  ok,
  notFound,
  serverError,
} from './helpers/index.js'

export class GetUserByIdController {
  async execute(httpRequest) {
    try {
      const isIdValid = checkIfIdIsValid(httpRequest.params.userId)

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
