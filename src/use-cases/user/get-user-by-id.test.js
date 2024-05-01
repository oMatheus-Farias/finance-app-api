import { faker } from '@faker-js/faker'
import { GetUserByIdUseCase } from './get-user-by-id'

describe('Get user By Id Use Case', () => {
    const user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        id: faker.string.uuid(),
        password: faker.internet.password({
            length: 8,
        }),
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getUserByIdRepositoryStub = new GetUserByIdRepositoryStub()
        const sut = new GetUserByIdUseCase(getUserByIdRepositoryStub)

        return { sut, getUserByIdRepositoryStub }
    }

    it('should get user by id successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(user.id)

        expect(result).toEqual(user)
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        const { sut, getUserByIdRepositoryStub } = makeSut()
        const executeSpy = import.meta.jest.spyOn(
            getUserByIdRepositoryStub,
            'execute',
        )

        await sut.execute(user.id)

        expect(executeSpy).toHaveBeenCalledWith(user.id)
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        const { sut, getUserByIdRepositoryStub } = makeSut()
        import.meta.jest
            .spyOn(getUserByIdRepositoryStub, 'execute')
            .mockRejectedValueOnce(new Error())

        const result = sut.execute(user.id)

        await expect(result).rejects.toThrow()
    })
})
