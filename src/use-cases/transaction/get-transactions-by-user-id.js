import { userNotFoundResponse } from '../../controllers/index.js'

export class GetTransactionsByUserIdUseCase {
  constructor(getTransactionsByUserIdRepository, getUserByIdRepository) {
    this.getTransactionsByUserIdRepository = getTransactionsByUserIdRepository
    this.getUserByIdRepository = getUserByIdRepository
  }

  async execute(getTransactionsParams) {
    const user = await this.getUserByIdRepository.execute(
      getTransactionsParams.userId,
    )

    if (!user) {
      return userNotFoundResponse()
    }

    const transactions = await this.getTransactionsByUserIdRepository.execute(
      getTransactionsParams.userId,
    )

    return transactions
  }
}
