import { UserNotFoundError } from '../../errors/user.js'

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
      throw new UserNotFoundError(getTransactionsParams.userId)
    }

    const transactions = await this.getTransactionsByUserIdRepository.execute(
      getTransactionsParams.userId,
    )

    return transactions
  }
}
