import { faker } from '@faker-js/faker'
import { PostgresUpdateTransactionRepository } from './update-transaction'
import { prisma } from '../../../../prisma/prisma'

describe('Postgres Update Transaction Repository', () => {
    const sut = new PostgresUpdateTransactionRepository()

    const userParams = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    }

    const transactionParams = {
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        date: faker.date.anytime().toISOString(),
        amount: Number(faker.finance.amount()),
        type: 'EARNING',
    }

    it('should update transaction on db', async () => {
        const user = await prisma.user.create({ data: userParams })
        const transaction = await prisma.transaction.create({
            data: {
                ...transactionParams,
                user_id: user.id,
            },
        })

        const updateTransactionParams = {
            name: faker.commerce.productName(),
            date: faker.date.anytime().toISOString(),
            amount: Number(faker.finance.amount()),
            type: 'EXPENSE',
        }

        const result = await sut.execute(
            transaction.id,
            updateTransactionParams,
        )

        expect(result.name).toBe(updateTransactionParams.name)
        expect(result.type).toBe(updateTransactionParams.type)
        expect(String(result.amount)).toBe(
            String(updateTransactionParams.amount),
        )
    })
})
