import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdUseCase } from './get-transactions-by-user-id.js'

describe('Get Transactions By User Id Use Case', () => {
    const user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        id: faker.string.uuid(),
        password: faker.internet.password({
            length: 8,
        }),
    }

    class GetTransactionsByUserIdRepositoryStub {
        async execute() {
            return []
        }
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    const makeSut = () => {
        const getTransactionsByUserIdRepositoryStub =
            new GetTransactionsByUserIdRepositoryStub()
        const getUserByIdRepositoryStub = new GetUserByIdRepositoryStub()

        const sut = new GetTransactionsByUserIdUseCase(
            getTransactionsByUserIdRepositoryStub,
            getUserByIdRepositoryStub,
        )

        return {
            sut,
            getTransactionsByUserIdRepositoryStub,
            getUserByIdRepositoryStub,
        }
    }

    it('should get transactions by user id successfully', async () => {
        const { sut } = makeSut()
        const result = await sut.execute(faker.string.uuid())

        expect(result).toEqual([])
    })

    it('should throw UserNotFoundError if user does not exist', async () => {
        const { sut, getUserByIdRepositoryStub } = makeSut()
        import.meta.jest
            .spyOn(getUserByIdRepositoryStub, 'execute')
            .mockReturnValueOnce(null)

        const result = sut.execute(faker.string.uuid())

        await expect(result).rejects.toThrow()
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        const { sut, getUserByIdRepositoryStub } = makeSut()
        import.meta.jest
            .spyOn(getUserByIdRepositoryStub, 'execute')
            .mockRejectedValueOnce(new Error())

        const result = sut.execute(faker.string.uuid())

        await expect(result).rejects.toThrow()
    })

    it('should throw if GetTransactionsByUserIdRepository throws', async () => {
        const { sut, getTransactionsByUserIdRepositoryStub } = makeSut()
        import.meta.jest
            .spyOn(getTransactionsByUserIdRepositoryStub, 'execute')
            .mockRejectedValueOnce(new Error())

        const result = sut.execute(faker.string.uuid())

        await expect(result).rejects.toThrow()
    })
})
