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
        async execute(password) {
            return password
        }
    }

    class IdGeneratorAdapterStub {
        execute() {
            return faker.string.uuid()
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
})
