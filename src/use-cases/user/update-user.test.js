import { faker } from '@faker-js/faker'
import { UpdateUserUseCase } from './update-user'
import { EmailAlreadyInUseError } from '../../errors/user'

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

    it('should throw EmailAlreadyInUseError if email is already in use', async () => {
        const { sut, getUserByEmailRepositoryStub } = makeSut()

        jest.spyOn(getUserByEmailRepositoryStub, 'execute').mockReturnValueOnce(
            user,
        )

        const result = sut.execute(faker.string.uuid(), {
            email: user.email,
        })

        await expect(result).rejects.toThrow(
            new EmailAlreadyInUseError(user.email),
        )
    })

    it('should call UpdateUserRepository with correct params', async () => {
        const { sut, updateUserRepositoryStub } = makeSut()
        const executeSpy = jest.spyOn(updateUserRepositoryStub, 'execute')

        await sut.execute(user.id, {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: user.password,
        })

        expect(executeSpy).toHaveBeenCalledWith(user.id, {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            password: 'password_hashed',
        })
    })

    it('should throw if GetUserByEmailRepository throws', async () => {
        const { sut, getUserByEmailRepositoryStub } = makeSut()
        jest.spyOn(
            getUserByEmailRepositoryStub,
            'execute',
        ).mockRejectedValueOnce(new Error())

        const result = sut.execute(user.id, {
            email: user.email,
        })

        await expect(result).rejects.toThrow()
    })

    it('should throw if PasswordHasherAdapter throws', async () => {
        const { sut, passwordHasherAdapter } = makeSut()
        jest.spyOn(passwordHasherAdapter, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const result = sut.execute(user.id, {
            password: user.password,
        })

        await expect(result).rejects.toThrow()
    })
})
