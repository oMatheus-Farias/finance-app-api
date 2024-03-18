import { faker } from '@faker-js/faker'
import { DeleteTransactionController } from './delete-transaction.js'

describe('Delete Transaction Controller', () => {
  class DeleteTransactionControllerStub {
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
    const deleteTransactionController = new DeleteTransactionControllerStub()
    const sut = new DeleteTransactionController(deleteTransactionController)

    return { deleteTransactionController, sut }
  }

  const httpRequest = {
    params: {
      transactionId: faker.string.uuid(),
    },
  }

  it('should return 200 when deleting transaction successfully', async () => {
    const { sut } = makeSut()

    const result = await sut.execute(httpRequest)

    expect(result.statusCode).toBe(200)
  })

  it('should return 400 when transaction id is invalid', async () => {
    const { sut } = makeSut()

    const result = await sut.execute({
      params: {
        transactionId: 'invalid_id',
      },
    })

    expect(result.statusCode).toBe(400)
  })
})
