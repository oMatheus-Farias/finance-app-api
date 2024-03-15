import { postgresHelper } from '../../../db/postgres/helper.js'

export class PostgresUpdateTransactionRepository {
  async execute(transactionId, updateTransactionParams) {
    const updateFields = []
    const updateValues = []

    Object.keys(updateTransactionParams).forEach((key) => {
      updateFields.push(`${key} = $${updateValues.length + 1}`)
      updateValues.push(updateTransactionParams[key])
    })

    updateValues.push(transactionId)

    const updateQuery = `
            UPDATE "Transaction"
            SET ${updateFields.join(', ')} 
            WHERE id = $${updateValues.length}
            RETURNING *
        `

    const updateTransaction = await postgresHelper.query(
      updateQuery,
      updateValues,
    )

    return updateTransaction[0]
  }
}
