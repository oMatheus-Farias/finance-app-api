import { UserNotFoundError } from '../../errors/user.js'

export class UpdateTransactionUseCase {
  constructor(updateTransactionRepository, getUserByIdRepository) {
    this.updateTransactionRepository = updateTransactionRepository
    this.getUserByIdRepository = getUserByIdRepository
  }

  async execute(updateTransactionParams) {
    const user = await this.getUserByIdRepository.execute(
      updateTransactionParams.userId,
    )

    if (!user) {
      throw new UserNotFoundError()
    }

    const transaction = await this.updateTransactionRepository.execute(
      updateTransactionParams,
    )

    return transaction
  }
}
