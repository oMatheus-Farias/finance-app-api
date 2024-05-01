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

    it('should call DeleteUserRepository with correct params', async () => {
        const { sut, deleteUserRepositoryStub } = makeSut()
        const userId = faker.string.uuid()

        const executeSpy = import.meta.jest.spyOn(
            deleteUserRepositoryStub,
            'execute',
        )

        await sut.execute(userId)

        expect(executeSpy).toHaveBeenCalledWith(userId)
    })

    it('should throw if DeleteUserRepository throws', async () => {
        const { sut, deleteUserRepositoryStub } = makeSut()

        import.meta.jest
            .spyOn(deleteUserRepositoryStub, 'execute')
            .mockImplementationOnce(new Error())

        const result = sut.execute(faker.string.uuid())

        await expect(result).rejects.toThrow()
    })
})
