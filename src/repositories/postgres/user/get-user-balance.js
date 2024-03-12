import { postgresHelper } from '../../../db/postgres/helper.js'

export class PostgresGetUserBalanceRepository {
  async execute(userId) {
    const result = await postgresHelper.query(
      `SELECT
        SUM(CASE WHEN type = 'EARNING' THEN amount ELSE 0 END) AS earnings,
        SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) AS expenses,
        SUM(CASE WHEN type = 'INVESTMENT' THEN amount ELSE 0 END) AS investiments,
        (
          SUM(CASE WHEN type = 'EARNING' THEN amount ELSE 0 END) 
          - SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END)
          - SUM(CASE WHEN type = 'INVESTMENT' THEN amount ELSE 0 END)
        ) AS balance
        FROM transactions
        WHERE user_id = $1;`,
      [userId],
    )

    return {
      userId,
      ...result[0],
    }
  }
}
