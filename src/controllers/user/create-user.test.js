import { faker } from '@faker-js/faker'
import { CreateUserController } from './create-user.js'

describe('Create User Controller', () => {
  class CreateUserUseCaseStub {
    execute(user) {
      return user
    }
  }

  it('should return 201 when creating a user successfully', async () => {
    const craeteUserUseCase = new CreateUserUseCaseStub()

    const createUserController = new CreateUserController(craeteUserUseCase)

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

    const result = await createUserController.execute(httpRequest)

    expect(result.statusCode).toBe(201)
    expect(result.body).toEqual(httpRequest.body)
  })

  it('should return 400 if first_name is not provided', async () => {
    const craeteUserUseCase = new CreateUserUseCaseStub()

    const createUserController = new CreateUserController(craeteUserUseCase)

    const httpRequest = {
      body: {
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
          length: 7,
        }),
      },
    }

    const result = await createUserController.execute(httpRequest)

    expect(result.statusCode).toBe(400)
  })

  it('should return 400 if last_name is not provided', async () => {
    const craeteUserUseCase = new CreateUserUseCaseStub()

    const createUserController = new CreateUserController(craeteUserUseCase)

    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password({
          length: 7,
        }),
      },
    }

    const result = await createUserController.execute(httpRequest)

    expect(result.statusCode).toBe(400)
  })

  it('should return 400 if email is not provided', async () => {
    const craeteUserUseCase = new CreateUserUseCaseStub()

    const createUserController = new CreateUserController(craeteUserUseCase)

    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        password: faker.internet.password({
          length: 7,
        }),
      },
    }

    const result = await createUserController.execute(httpRequest)

    expect(result.statusCode).toBe(400)
  })

  it('should return 400 if email is not valid', async () => {
    const createUserUseCase = new CreateUserUseCaseStub()

    const createUserController = new CreateUserController(createUserUseCase)

    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: 'invalid_email',
        password: faker.internet.password({
          length: 7,
        }),
      },
    }

    const result = await createUserController.execute(httpRequest)

    expect(result.statusCode).toBe(400)
  })

  it('should return 400 if password is not provided', async () => {
    const craeteUserUseCase = new CreateUserUseCaseStub()

    const createUserController = new CreateUserController(craeteUserUseCase)

    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
      },
    }

    const result = await createUserController.execute(httpRequest)

    expect(result.statusCode).toBe(400)
  })

  it('should return 400 if password is less than 6 characters', async () => {
    const craeteUserUseCase = new CreateUserUseCaseStub()

    const createUserController = new CreateUserController(craeteUserUseCase)

    const httpRequest = {
      body: {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
          length: 5,
        }),
      },
    }

    const result = await createUserController.execute(httpRequest)

    expect(result.statusCode).toBe(400)
  })

  it('should call CreateUserUseCase with correct params', async () => {
    const createUserUseCase = new CreateUserUseCaseStub()

    const createUserController = new CreateUserController(createUserUseCase)

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

    const executeSpy = jest.spyOn(createUserUseCase, 'execute')

    await createUserController.execute(httpRequest)

    expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  it('should return 500 if CreateUserUseCase throws', async () => {
    const createUserUseCase = new CreateUserUseCaseStub()

    const createUserController = new CreateUserController(createUserUseCase)

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

    jest.spyOn(createUserUseCase, 'execute').mockImplementationOnce(() => {
      throw new Error()
    })

    const result = await createUserController.execute(httpRequest)

    expect(result.statusCode).toBe(500)
  })
})
