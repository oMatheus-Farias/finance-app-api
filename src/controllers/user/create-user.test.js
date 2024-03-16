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
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@doe.com',
        password: 'password',
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
        last_name: 'Doe',
        email: 'john@doe.com',
        password: 'password',
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
        first_name: 'John',
        email: 'john@doe.com',
        password: 'password',
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
        first_name: 'John',
        last_name: 'Doe',
        password: 'password',
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
        first_name: 'John',
        last_name: 'Doe',
        email: 'john',
        password: 'password',
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
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@doe.com',
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
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@doe.com',
        password: 'pass',
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
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@doe.com',
        password: 'password',
      },
    }

    const executeSpy = jest.spyOn(createUserUseCase, 'execute')

    await createUserController.execute(httpRequest)

    expect(executeSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})
