import { faker } from '@faker-js/faker'
import { UpdateUserUseCase } from './update-user'

describe('Update User Use Case', () => {
    const user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        id: faker.string.uuid(),
        password: faker.internet.password({
            length: 8,
        }),
    }

    class GetUserByEmailRepositoryStub {
        async execute() {
            return null
        }
    }

    class UpdateUserRepositoryStub {
        async execute() {
            return user
        }
    }

    class PasswordHasherAdapter {
        async execute() {
            return 'password_hashed'
        }
    }

    const makeSut = () => {
        const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub()
        const updateUserRepositoryStub = new UpdateUserRepositoryStub()
        const passwordHasherAdapter = new PasswordHasherAdapter()

        const sut = new UpdateUserUseCase(
            getUserByEmailRepositoryStub,
            updateUserRepositoryStub,
            passwordHasherAdapter,
        )

        return {
            sut,
            getUserByEmailRepositoryStub,
            updateUserRepositoryStub,
            passwordHasherAdapter,
        }
    }

    it('should update user successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(user.id, {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
        })

        expect(result).toBe(user)
    })
})
