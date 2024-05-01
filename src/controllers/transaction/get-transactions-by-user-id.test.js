import { faker } from '@faker-js/faker'
import { GetTransactionsByUserIdController } from './get-transactions-by-user-id.js'
import { UserNotFoundError } from '../../errors/user.js'

describe('Get Transactions By User Id Controller', () => {
    class GetTransactionsByUserIdUseCaseStub {
        async execute() {
            return {
                id: faker.string.uuid(),
                user_id: faker.string.uuid(),
                name: faker.commerce.productName(),
                date: faker.date.anytime().toISOString(),
                amount: Number(faker.finance.amount()),
                type: faker.helpers.arrayElement([
                    'EARNING',
                    'EXPENSE',
                    'INVESTMENT',
                ]),
            }
        }
    }

    const makeSut = () => {
        const getTransactionsByUserIdUseCase =
            new GetTransactionsByUserIdUseCaseStub()
        const sut = new GetTransactionsByUserIdController(
            getTransactionsByUserIdUseCase,
        )
        return { sut, getTransactionsByUserIdUseCase }
    }

    const httpRequest = {
        query: {
            userId: faker.string.uuid(),
        },
    }

    it('should return 200 when getting transactions successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(200)
    })

    it('should return 400 when userId is not provided', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            query: {
                userId: undefined,
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 400 when userId is invalid', async () => {
        const { sut } = makeSut()

        const result = await sut.execute({
            query: {
                userId: 'invalid_id',
            },
        })

        expect(result.statusCode).toBe(400)
    })

    it('should return 404 if GetTransactionsByUserIdUseCase throws UserNotFoundError', async () => {
        const { getTransactionsByUserIdUseCase, sut } = makeSut()
        import.meta.jest
            .spyOn(getTransactionsByUserIdUseCase, 'execute')
            .mockRejectedValueOnce(new UserNotFoundError())

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(404)
    })

    it('should return 500 if GetTransactionsByUserIdUseCase throws', async () => {
        const { getTransactionsByUserIdUseCase, sut } = makeSut()
        import.meta.jest
            .spyOn(getTransactionsByUserIdUseCase, 'execute')
            .mockRejectedValueOnce(new Error())

        const result = await sut.execute(httpRequest)

        expect(result.statusCode).toBe(500)
    })

    it('should call GetTransactionsByUserIdUseCase with correct params', async () => {
        const { getTransactionsByUserIdUseCase, sut } = makeSut()
        const executeSpy = import.meta.jest.spyOn(
            getTransactionsByUserIdUseCase,
            'execute',
        )

        await sut.execute(httpRequest)

        expect(executeSpy).toHaveBeenCalledWith(httpRequest.query)
    })
})
