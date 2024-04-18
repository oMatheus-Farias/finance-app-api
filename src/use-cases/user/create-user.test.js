import { faker } from '@faker-js/faker'
import { CreateUserUseCase } from './create-user.js'

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

        const user = sut.execute({
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            email: faker.internet.email(),
            id: faker.string.uuid(),
            password: faker.internet.password({
                length: 8,
            }),
        })

        expect(user).toBeTruthy()
    })
})
