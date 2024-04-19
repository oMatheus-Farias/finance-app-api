import { faker } from '@faker-js/faker'
import { CreateUserUseCase } from './create-user.js'
import { EmailAlreadyInUseError } from '../../errors/user.js'

describe('Create User Use Case', () => {
    class GetUserByEmailRepositoryStub {
        async execute() {
            return null
        }
    }

    class CreateUserRepositoryStub {
        async execute(user) {
            return user
        }
    }

    class PasswordHasherAdapterStub {
        async execute() {
            return 'hashed_password'
        }
    }

    class IdGeneratorAdapterStub {
        execute() {
            return 'generate_id'
        }
    }

    const user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        id: faker.string.uuid(),
        password: faker.internet.password({
            length: 8,
        }),
    }

    const makeSut = () => {
        const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub()
        const createUserRepositoryStub = new CreateUserRepositoryStub()
        const passwordHasherAdapterStub = new PasswordHasherAdapterStub()
        const idGeneratorAdapterStub = new IdGeneratorAdapterStub()

        const sut = new CreateUserUseCase(
            getUserByEmailRepositoryStub,
            createUserRepositoryStub,
            passwordHasherAdapterStub,
            idGeneratorAdapterStub,
        )

        return {
            sut,
            getUserByEmailRepositoryStub,
            createUserRepositoryStub,
            passwordHasherAdapterStub,
            idGeneratorAdapterStub,
        }
    }

    it('should sucessfully create a user', () => {
        const { sut } = makeSut()

        const _user = sut.execute(user)

        expect(_user).toBeTruthy()
    })

    it('should throw an EmailAlreadyInUser if GetuserByEmailRepository returns a user', async () => {
        const { sut, getUserByEmailRepositoryStub } = makeSut()

        jest.spyOn(getUserByEmailRepositoryStub, 'execute').mockReturnValueOnce(
            user,
        )

        const result = sut.execute(user)

        await expect(result).rejects.toThrow(
            new EmailAlreadyInUseError(user.email),
        )
    })

    it('should call IdGenerator to generate a random id ', async () => {
        const { sut, idGeneratorAdapterStub, createUserRepositoryStub } =
            makeSut()

        const idGeneratorSpy = jest.spyOn(idGeneratorAdapterStub, 'execute')
        const createUserRepositorySpy = jest.spyOn(
            createUserRepositoryStub,
            'execute',
        )

        await sut.execute(user)

        expect(idGeneratorSpy).toHaveBeenCalled()
        expect(createUserRepositorySpy).toHaveBeenCalledWith({
            ...user,
            id: 'generate_id',
            password: 'hashed_password',
        })
    })

    it('should call PasswordHasherAdapter cryptograph password', async () => {
        const {
            sut,

            passwordHasherAdapterStub,
        } = makeSut()

        const passwordHasherSpy = jest.spyOn(
            passwordHasherAdapterStub,
            'execute',
        )

        await sut.execute(user)

        expect(passwordHasherSpy).toHaveBeenCalledWith(user.password)
    })

    it('should throw if GetUserByEmailRepository throws', async () => {
        const { sut, getUserByEmailRepositoryStub } = makeSut()

        jest.spyOn(
            getUserByEmailRepositoryStub,
            'execute',
        ).mockRejectedValueOnce(new Error())

        const result = sut.execute(user)

        await expect(result).rejects.toThrow()
    })

    it('should throw if IdGeneratorAdapter throws', async () => {
        const { sut, idGeneratorAdapterStub } = makeSut()

        jest.spyOn(idGeneratorAdapterStub, 'execute').mockImplementationOnce(
            new Error(),
        )

        const result = sut.execute(user)

        await expect(result).rejects.toThrow()
    })
})
