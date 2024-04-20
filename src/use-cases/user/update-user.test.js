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

    it('should update user successfully (with email)', async () => {
        const { sut, getUserByEmailRepositoryStub } = makeSut()

        const executeSpy = jest.spyOn(getUserByEmailRepositoryStub, 'execute')
        const userEmail = faker.internet.email()

        const result = await sut.execute(user.id, {
            email: userEmail,
        })

        expect(executeSpy).toHaveBeenCalledWith(userEmail)
        expect(result).toBe(user)
    })

    it('should update user successfully (with password)', async () => {
        const { sut, passwordHasherAdapter } = makeSut()

        const executeSpy = jest.spyOn(passwordHasherAdapter, 'execute')
        const userPassword = faker.internet.password()

        const result = await sut.execute(user.id, {
            password: userPassword,
        })

        expect(executeSpy).toHaveBeenCalledWith(userPassword)
        expect(result).toBe(user)
    })
})
