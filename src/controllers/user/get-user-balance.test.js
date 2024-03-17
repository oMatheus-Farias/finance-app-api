import { faker } from '@faker-js/faker'
import { GetUserBalanceController } from './get-user-balance.js'

describe('Get User Balance Controller', () => {
  class GetUserBalanceUseCaseStub {
    execute() {
      return faker.finance.amount()
    }
  }

  const makeSut = () => {
    const getUserBalanceUseCase = new GetUserBalanceUseCaseStub()
    const sut = new GetUserBalanceController(getUserBalanceUseCase)

    return { getUserBalanceUseCase, sut }
  }

  const httpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
  }

  it('should return 200 when getting user balance', async () => {
    const { sut } = makeSut()

    const result = await sut.execute(httpRequest)

    expect(result.statusCode).toBe(200)
  })
})
