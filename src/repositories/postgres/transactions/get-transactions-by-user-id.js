import { postgresHelper } from '../../../db/postgres/helper.js'

export class PostgresGetTransactionsByUserIdRepository {
    async execute(userId) {
        const result = await postgresHelper.query(
            'SELECT * FROM "Transaction" WHERE user_id = $1',
            [userId],
        )

        return result
    }
}
