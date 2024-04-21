import { faker } from '@faker-js/faker'
import { DeleteTransactionUseCase } from './delete-transaction.js'

describe('Delete Transaction Use Case', () => {
    const user = {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        id: faker.string.uuid(),
        password: faker.internet.password({
            length: 8,
        }),
    }

    const transaction = {
        id: faker.string.uuid(),
        user_id: faker.string.uuid(),
        user,
        name: faker.commerce.productName(),
        date: faker.date.anytime().toISOString(),
        amount: Number(faker.finance.amount()),
        type: 'EXPENSE',
    }

    class DeleteTransactionRepositoryStub {
        async execute(transactionId) {
            return {
                ...transaction,
                id: transactionId,
            }
        }
    }

    const makeSut = () => {
        const deleteTransactionRepositoryStub =
            new DeleteTransactionRepositoryStub()
        const sut = new DeleteTransactionUseCase(
            deleteTransactionRepositoryStub,
        )

        return {
            sut,
            deleteTransactionRepositoryStub,
        }
    }

    it('should delete a transaction successfully', async () => {
        const { sut } = makeSut()
        const result = await sut.execute(transaction.id)

        expect(result).toEqual(transaction)
    })

    it('should call DeleteTransactionRepository with correct params', async () => {
        const { sut, deleteTransactionRepositoryStub } = makeSut()
        const executeSpy = jest.spyOn(
            deleteTransactionRepositoryStub,
            'execute',
        )

        await sut.execute(transaction.id)

        expect(executeSpy).toHaveBeenCalledWith(transaction.id)
    })

    it('should throw if DeleteTransactionRepository throws', async () => {
        const { sut, deleteTransactionRepositoryStub } = makeSut()
        jest.spyOn(
            deleteTransactionRepositoryStub,
            'execute',
        ).mockRejectedValueOnce(new Error())

        const result = sut.execute(transaction.id)

        await expect(result).rejects.toThrow()
    })
})
