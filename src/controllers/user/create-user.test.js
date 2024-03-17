import { faker } from '@faker-js/faker'
import { CreateUserController } from './create-user.js'
import { EmailAlreadyInUseError } from '../../errors/user.js'

describe('Create User Controller', () => {
  class CreateUserUseCaseStub {
    execute(user) {
      return user
    }
  }

  const makeSut = () => {
    const createUserUseCase = new CreateUserUseCaseStub()
    const sut = new CreateUserController(createUserUseCase)

    return { createUserUseCase, sut }
  }

  const httpRequest = {
    body: {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({
        length: 7,
      }),
    },
  }

  it('should return 201 when creating a user successfully', async () => {
    const { sut } = makeSut()

    const result = await sut.execute(httpRequest)

    expect(result.statusCode).toBe(201)
    expect(result.body).toEqual(httpRequest.body)
  })

  it('should return 400 if first_name is not provided', async () => {
    const { sut } = makeSut()

    const result = await sut.execute({
      body: { ...httpRequest.body, first_name: undefined },
    })

    expect(result.statusCode).toBe(400)
  })

  it('should return 400 if last_name is not provided', async () => {
    const { sut } = makeSut()

    const result = await sut.execute({
      body: { ...httpRequest.body, last_name: undefined },
    })

    expect(result.statusCode).toBe(400)
  })

  it('should return 400 if email is not provided', async () => {
    const { sut } = makeSut()

    const result = await sut.execute({
      body: { ...httpRequest.body, email: undefined },
    })

    expect(result.statusCode).toBe(400)
  })

  it('should return 400 if email is not valid', async () => {
    const { sut } = makeSut()

    const result = await sut.execute({
      body: { ...httpRequest.body, email: 'email_invalid' },
    })

    expect(result.statusCode).toBe(400)
  })

  it('should return 400 if password is not provided', async () => {
    const { sut } = makeSut()

    const result = await sut.execute({
      body: { ...httpRequest.body, password: undefined },
    })

    expect(result.statusCode).toBe(400)
  })

  it('should return 400 if password is less than 6 characters', async () => {
    const { sut } = makeSut()

    const result = await sut.execute({
      body: {
        ...httpRequest.body,
        password: faker.internet.password({ length: 5 }),
      },
    })

    expect(result.statusCode).toBe(400)
  })

  it('should call CreateUserUseCase with correct params', async () => {
    const { sut, createUserUseCase } = makeSut()
    const executeSpy = jest.spyOn(createUserUseCase, 'execute')

    await sut.execute(httpRequest)

    expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('should return 500 if CreateUserUseCase throws', async () => {
    const { sut, createUserUseCase } = makeSut()
    jest.spyOn(createUserUseCase, 'execute').mockImplementationOnce(() => {
      throw new Error()
    })

    const result = await sut.execute(httpRequest)

    expect(result.statusCode).toBe(500)
  })

  it('should return 400 if CreateUserUseCase throws EmailAlreadyInUseError', async () => {
    const { sut, createUserUseCase } = makeSut()
    jest.spyOn(createUserUseCase, 'execute').mockImplementationOnce(() => {
      throw new EmailAlreadyInUseError()
    })

    const result = await sut.execute(httpRequest)

    expect(result.statusCode).toBe(400)
  })
})
