import { faker } from '@faker-js/faker'
import { PostgresCreateUserRepository } from './create-user'

describe('Create User Repository', () => {
    const createUserParams = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 8,
        }),
    }

    const makeSut = () => {
        const sut = new PostgresCreateUserRepository()

        return {
            sut,
        }
    }

    it('should create a user on db', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(createUserParams)

        expect(result.id).toBe(createUserParams.id)
        expect(result.first_name).toBe(createUserParams.first_name)
        expect(result.last_name).toBe(createUserParams.last_name)
        expect(result.email).toBe(createUserParams.email)
        expect(result.password).toBe(createUserParams.password)
    })
})
