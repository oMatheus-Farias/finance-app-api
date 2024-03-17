import { faker } from '@faker-js/faker'
import { UpdateUserController } from './update-user.js'

describe('Update User Controller', () => {
  class UpdateUserUseCaseStub {
    async execute(user) {
      return user
    }
  }

  const makeSut = () => {
    const updateUserUseCase = new UpdateUserUseCaseStub()
    const sut = new UpdateUserController(updateUserUseCase)

    return { updateUserUseCase, sut }
  }

  const httpRequest = {
    params: {
      userId: faker.string.uuid(),
    },
    body: {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({
        length: 7,
      }),
    },
  }

  it('should return 200 when user is updated', async () => {
    const { sut } = makeSut()

    const result = await sut.execute(httpRequest)

    expect(result.statusCode).toBe(200)
  })
})
