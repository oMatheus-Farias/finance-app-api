import { postgresHelper } from '../../db/postgres/helper.js'

export class PostgresDeleteUserRepository {
  async execute(userId) {
    const deleteUser = await postgresHelper.query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [userId],
    )

    return deleteUser[0]
  }
}
