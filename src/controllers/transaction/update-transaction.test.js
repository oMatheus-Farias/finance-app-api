import { faker } from '@faker-js/faker'
import { UpdateTransactionController } from './update-transaction.js'

describe('Update Transaction Controller', () => {
  class UpdateTransactionUseCaseStub {
    async execute() {
      return {
        id: faker.string.uuid(),
        user_id: faker.string.uuid(),
        name: faker.commerce.productName(),
        date: faker.date.anytime().toISOString(),
        amount: Number(faker.finance.amount()),
        type: faker.helpers.arrayElement(['EARNING', 'EXPENSE', 'INVESTMENT']),
      }
    }
  }

  const makeSut = () => {
    const updateTransactionUseCase = new UpdateTransactionUseCaseStub()
    const sut = new UpdateTransactionController(updateTransactionUseCase)

    return { updateTransactionUseCase, sut }
  }

  const httpRequest = {
    params: {
      transactionId: faker.string.uuid(),
    },
    body: {
      name: faker.commerce.productName(),
      date: faker.date.anytime().toISOString(),
      amount: Number(faker.finance.amount()),
      type: faker.helpers.arrayElement(['EARNING', 'EXPENSE', 'INVESTMENT']),
    },
  }

  it('should return 200 if update transaction is successfully', async () => {
    const { sut } = makeSut()

    const result = await sut.execute(httpRequest)

    expect(result.statusCode).toBe(200)
  })

  it('should retrun 400 if transactionId is invalid', async () => {
    const { sut } = makeSut()

    const result = await sut.execute({
      params: {
        transactionId: 'invalid_id',
      },
      body: {
        ...httpRequest.body,
      },
    })

    expect(result.statusCode).toBe(400)
  })

  it('should retrun 400 when unallowed field is provided', async () => {
    const { sut } = makeSut()

    const result = await sut.execute({
      params: {
        transactionId: faker.string.uuid(),
      },
      body: {
        ...httpRequest.body,
        unallowed_field: 'unallowed',
      },
    })

    expect(result.statusCode).toBe(400)
  })

  it('should retrun 400 when amount field is invalid', async () => {
    const { sut } = makeSut()

    const result = await sut.execute({
      params: {
        transactionId: faker.string.uuid(),
      },
      body: {
        ...httpRequest.body,
        amount: 'invalid_amount',
      },
    })

    expect(result.statusCode).toBe(400)
  })

  it('should retrun 400 when type field is invalid', async () => {
    const { sut } = makeSut()

    const result = await sut.execute({
      params: {
        transactionId: faker.string.uuid(),
      },
      body: {
        ...httpRequest.body,
        type: 'INVALID_TYPE',
      },
    })

    expect(result.statusCode).toBe(400)
  })
})
