import { postgresHelper } from '../../../db/postgres/helper.js'

export class PostgresDeleteTransactionRepository {
  async execute(transactionId) {
    const transaction = await postgresHelper.query(
      'DELETE FROM transactions WHERE id = $1 RETURNING *',
      [transactionId],
    )

    return transaction[0]
  }
}
