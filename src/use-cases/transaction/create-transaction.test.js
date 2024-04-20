import { faker } from '@faker-js/faker'
import { CreateTransactionUseCase } from './create-transaction'
import { UserNotFoundError } from '../../errors/user'

describe('Create Transaction Use Case', () => {
    const user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        id: faker.string.uuid(),
        password: faker.internet.password({
            length: 8,
        }),
    }

    const createTransactionParams = {
        user_id: faker.string.uuid(),
        user,
        name: faker.commerce.productName(),
        date: faker.date.anytime().toISOString(),
        amount: Number(faker.finance.amount()),
        type: 'EXPENSE',
    }

    class CreateTransactionRepositoryStub {
        async execute(transaction) {
            return transaction
        }
    }

    class GetUserByIdRepositoryStub {
        async execute() {
            return user
        }
    }

    class IdGeneratorAdapterStub {
        execute() {
            return 'random_id'
        }
    }

    const makeSut = () => {
        const createTransactionRepositoryStub =
            new CreateTransactionRepositoryStub()
        const getUserByIdRepository = new GetUserByIdRepositoryStub()
        const idGeneratorAdapter = new IdGeneratorAdapterStub()

        const sut = new CreateTransactionUseCase(
            createTransactionRepositoryStub,
            getUserByIdRepository,
            idGeneratorAdapter,
        )

        return {
            sut,
            createTransactionRepositoryStub,
            getUserByIdRepository,
            idGeneratorAdapter,
        }
    }

    it('should create transaction successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(createTransactionParams)

        expect(result).toEqual({ ...createTransactionParams, id: 'random_id' })
    })

    it('should call GetUserByIdRepository with correct params', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        const executeSpy = jest.spyOn(getUserByIdRepository, 'execute')

        await sut.execute(createTransactionParams)

        expect(executeSpy).toHaveBeenCalledWith(createTransactionParams.user_id)
    })

    it('should call IdGeneratorAdapter', async () => {
        const { sut, idGeneratorAdapter } = makeSut()
        const executeSpy = jest.spyOn(idGeneratorAdapter, 'execute')

        await sut.execute(createTransactionParams)

        expect(executeSpy).toHaveBeenCalled()
    })

    it('should call CreateTransactionRepository with correct params', async () => {
        const { sut, createTransactionRepositoryStub } = makeSut()
        const executeSpy = jest.spyOn(
            createTransactionRepositoryStub,
            'execute',
        )

        await sut.execute(createTransactionParams)

        expect(executeSpy).toHaveBeenCalledWith({
            ...createTransactionParams,
            id: 'random_id',
        })
    })

    it('should throw UserNotFoundError if user does not exist', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockResolvedValue(null)

        const result = sut.execute(createTransactionParams)

        await expect(result).rejects.toThrow(
            new UserNotFoundError(createTransactionParams.user_id),
        )
    })

    it('should throw if GetUserByIdRepository throws', async () => {
        const { sut, getUserByIdRepository } = makeSut()
        jest.spyOn(getUserByIdRepository, 'execute').mockRejectedValueOnce(
            new Error(),
        )

        const result = sut.execute(createTransactionParams)

        await expect(result).rejects.toThrow()
    })

    it('should throw if IdGeneratorAdapter throws', async () => {
        const { sut, idGeneratorAdapter } = makeSut()
        jest.spyOn(idGeneratorAdapter, 'execute').mockImplementationOnce(
            new Error(),
        )

        const result = sut.execute(createTransactionParams)

        await expect(result).rejects.toThrow()
    })

    it('should throw if CreateTransactionRepository throws', async () => {
        const { sut, createTransactionRepositoryStub } = makeSut()
        jest.spyOn(
            createTransactionRepositoryStub,
            'execute',
        ).mockRejectedValueOnce(new Error())

        const result = sut.execute(createTransactionParams)

        await expect(result).rejects.toThrow()
    })
})
