import {
  PostgresCreateTransactionRepository,
  PostgresGetTransactionsByUserIdRepository,
  PostgresGetUserByIdRepository,
} from '../../repositories/postgres/index.js'
import {
  CreateTransactionUseCase,
  GetTransactionsByUserIdUseCase,
} from '../../use-cases/index.js'
import {
  CreateTransactionController,
  GetTransactionsByUserIdController,
} from '../../controllers/index.js'

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
