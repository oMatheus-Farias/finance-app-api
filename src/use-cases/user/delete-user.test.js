import { faker } from '@faker-js/faker'
import { DeleteUserUseCase } from './delete-user'

describe('Delete User Use Case', () => {
    const user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        id: faker.string.uuid(),
        password: faker.internet.password({
            length: 8,
        }),
    }

    class DeleteuserRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const deleteUserRepositoryStub = new DeleteuserRepositoryStub()
        const sut = new DeleteUserUseCase(deleteUserRepositoryStub)

        return { sut, deleteUserRepositoryStub }
    }
    it('should successfully delete a user', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(faker.string.uuid())

        expect(result).toEqual(user)
    })
})
