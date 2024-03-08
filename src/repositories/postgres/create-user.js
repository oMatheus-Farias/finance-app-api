import { prostgresHelper } from '../../db/postgres/helper.js'

export class PostgresCreateUserRepository {
  async execute(createUserParams) {
    const result = await prostgresHelper.query(
      'INSERT INTO users (ID, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5)',
      [
        createUserParams.ID,
        createUserParams.first_name,
        createUserParams.last_name,
        createUserParams.email,
        createUserParams.password,
      ],
    )
    return result[0]
  }
}
