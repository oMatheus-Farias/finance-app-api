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
    expect(result.body).toBe(httpRequest.body)
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
})
