import { faker } from '@faker-js/faker'
import { UpdateUserController } from './update-user.js'
import { EmailAlreadyInUseError } from '../../errors/user.js'

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

  it('should return 400 when an invalid email is provided', async () => {
    const { sut } = makeSut()

    const result = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        email: 'invalid_email',
      },
    })

    expect(result.statusCode).toBe(400)
  })

  it('should return 400 when an invalid password is provided', async () => {
    const { sut } = makeSut()

    const result = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        password: faker.internet.password({
          length: 5,
        }),
      },
    })

    expect(result.statusCode).toBe(400)
  })

  it('should return 400 when an invalid id is provided', async () => {
    const { sut } = makeSut()

    const result = await sut.execute({
      params: {
        userId: 'invalid_id',
      },
      body: {
        ...httpRequest.body,
      },
    })

    expect(result.statusCode).toBe(400)
  })

  it('should return 400 when an unallowed field is provided', async () => {
    const { sut } = makeSut()

    const result = await sut.execute({
      ...httpRequest,
      body: {
        ...httpRequest.body,
        unallowed_field: 'unallowed_value',
      },
    })

    expect(result.statusCode).toBe(400)
  })

  it('should return 500 if UpdateUserUseCase throws an error', async () => {
    const { sut, updateUserUseCase } = makeSut()
    jest.spyOn(updateUserUseCase, 'execute').mockRejectedValueOnce(new Error())

    const result = await sut.execute(httpRequest)

    expect(result.statusCode).toBe(500)
  })

  it('should return 400 if UpdateUserUseCase throws an EmailAlreadyInUseError', async () => {
    const { sut, updateUserUseCase } = makeSut()
    jest
      .spyOn(updateUserUseCase, 'execute')
      .mockRejectedValueOnce(new EmailAlreadyInUseError(faker.internet.email()))

    const result = await sut.execute(httpRequest)

    expect(result.statusCode).toBe(400)
  })

  it('should call UpdateUserUseCase with correct params', async () => {
    const { updateUserUseCase, sut } = makeSut()
    const executeSpy = jest.spyOn(updateUserUseCase, 'execute')

    await sut.execute(httpRequest)

    expect(executeSpy).toHaveBeenCalledWith(
      httpRequest.params.userId,
      httpRequest.body,
    )
  })
})
