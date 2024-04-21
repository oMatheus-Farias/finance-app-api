import { faker } from '@faker-js/faker'
import { UpdateTransactionUseCase } from './update-transaction'

describe('Update Transaction Use Case', () => {
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

    class UpdateTransactionRepositoryStub {
        async execute(transactionId) {
            return { id: transactionId, ...transaction }
        }
    }

    const makeSut = () => {
        const updateTransactionRepositoryStub =
            new UpdateTransactionRepositoryStub()
        const sut = new UpdateTransactionUseCase(
            updateTransactionRepositoryStub,
        )

        return {
            sut,
            updateTransactionRepositoryStub,
        }
    }

    it('should update transaction successfully', async () => {
        const { sut } = makeSut()

        const result = await sut.execute(transaction.id, {
            amount: Number(faker.finance.amount()),
        })

        expect(result).toEqual(transaction)
    })
})
