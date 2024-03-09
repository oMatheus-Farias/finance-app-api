import { PostgresGetUserByIdRepositoru } from '../repositories/postgres/get-user-by-id.js'

export class GetUserByIdUseCase {
  async execute(userId) {
    const getUserByIdRepositpry = new PostgresGetUserByIdRepositoru()

    const user = await getUserByIdRepositpry.execute(userId)

    return user
  }
}
