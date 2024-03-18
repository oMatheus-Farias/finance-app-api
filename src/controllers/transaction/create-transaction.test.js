import { faker } from '@faker-js/faker'
import { CreateTransactionController } from './create-transaction.js'

describe('Create Transaction Controller', () => {
  class CreateTransactionUseCaseStub {
    async execute(transaction) {
      return transaction
    }
  }

  const makeSut = () => {
    const createTransactionUseCase = new CreateTransactionUseCaseStub()
    const sut = new CreateTransactionController(createTransactionUseCase)

    return { createTransactionUseCase, sut }
  }

  const httpRequest = {
    body: {
      user_id: faker.string.uuid(),
      name: faker.commerce.productName(),
      date: faker.date.anytime().toISOString(),
      amount: Number(faker.finance.amount()),
      type: faker.helpers.arrayElement(['EARNING', 'EXPENSE', 'INVESTMENT']),
    },
  }

  it('should return 201 when creating transaction successfully', async () => {
    const { sut } = makeSut()

    const result = await sut.execute(httpRequest)

    expect(result.statusCode).toBe(201)
  })

  it('should return 400 when missing user_id', async () => {
    const { sut } = makeSut()

    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        user_id: undefined,
      },
    })

    expect(result.statusCode).toBe(400)
  })

  it('should return 400 when missing name', async () => {
    const { sut } = makeSut()

    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        name: undefined,
      },
    })

    expect(result.statusCode).toBe(400)
  })

  it('should return 400 when missing date', async () => {
    const { sut } = makeSut()

    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        date: undefined,
      },
    })

    expect(result.statusCode).toBe(400)
  })

  it('should return 400 when missing amount', async () => {
    const { sut } = makeSut()

    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        amount: undefined,
      },
    })

    expect(result.statusCode).toBe(400)
  })

  it('should return 400 when missing type', async () => {
    const { sut } = makeSut()

    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        type: undefined,
      },
    })

    expect(result.statusCode).toBe(400)
  })
})
