import { faker } from '@faker-js/faker'
import { GetUserByIdController } from './get-user-by-id.js'

describe('Get User By Id Controller', () => {
  class GetUserByIdUseCaseStub {
    async execute() {
      return {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
          length: 7,
        }),
      }
    }
  }

  const makeSut = () => {
    const getUserByIdUseCase = new GetUserByIdUseCaseStub()
    const sut = new GetUserByIdController(getUserByIdUseCase)

    return { getUserByIdUseCase, sut }
  }

  const httpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
  }

  it('should return 200 if a user if found', async () => {
    const { sut } = makeSut()

    const result = await sut.execute(httpRequest)

    expect(result.statusCode).toBe(200)
  })
})
