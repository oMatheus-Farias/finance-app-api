import {
  PostgresCreateTransactionRepository,
  PostgresGetTransactionsByUserIdRepository,
  PostgresGetUserByIdRepository,
} from '../../repositories/postgres/index.js'
import {
  CreateTransactionUseCase,
  GetTransactionsByUserIdUseCase,
  UpdateTransactionUseCase,
} from '../../use-cases/index.js'
import {
  CreateTransactionController,
  GetTransactionsByUserIdController,
  UpdateTransactionController,
} from '../../controllers/index.js'
import { PostgresUpdateTransactionRepository } from '../../repositories/postgres/transactions/update-transaction.js'

export const makeCreateTransactionController = () => {
  const createTransactionRepository = new PostgresCreateTransactionRepository()
  const getUserByIdRepository = new PostgresGetUserByIdRepository()

  const createTransactionUseCase = new CreateTransactionUseCase(
    createTransactionRepository,
    getUserByIdRepository,
  )

  const createTransactionController = new CreateTransactionController(
    createTransactionUseCase,
  )

  return createTransactionController
}

export const makeGetTransactionsByUserIdController = () => {
  const getTransactionsByUserIdRepository =
    new PostgresGetTransactionsByUserIdRepository()
  const getUserByIdRepository = new PostgresGetUserByIdRepository()

  const getTransactionsByUSerIdUseCase = new GetTransactionsByUserIdUseCase(
    getTransactionsByUserIdRepository,
    getUserByIdRepository,
  )

  const getTransactionsByUserIdController =
    new GetTransactionsByUserIdController(getTransactionsByUSerIdUseCase)

  return getTransactionsByUserIdController
}

export const makeUpdateTransactionController = () => {
  const updateTransactionRepository = new PostgresUpdateTransactionRepository()

  const updateTransactionUseCase = new UpdateTransactionUseCase(
    updateTransactionRepository,
  )

  const updateTransactionController = new UpdateTransactionController(
    updateTransactionUseCase,
  )

  return updateTransactionController
}
