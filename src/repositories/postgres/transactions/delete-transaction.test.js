import { faker } from '@faker-js/faker'
import { PostgresDeleteTransactionRepository } from './delete-transaction.js'
import { prisma } from '../../../../prisma/prisma.js'
import dayjs from 'dayjs'

describe('Postgres Delete Transaction Repository', () => {
    const sut = new PostgresDeleteTransactionRepository()

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

    it('should delete a transaction on db', async () => {
        const user = await prisma.user.create({ data: userParams })
        const transaction = await prisma.transaction.create({
            data: {
                ...transactionParams,
                user_id: user.id,
            },
        })

        const result = await sut.execute(transaction.id)

        expect(result).not.toBeNull()
        expect(result.type).toBe(transaction.type)
        expect(result.name).toBe(transaction.name)
        expect(result.user_id).toBe(user.id)
        expect(String(result.amount)).toBe(String(transaction.amount))
        expect(dayjs(result.date).daysInMonth()).toBe(
            dayjs(transaction.date).daysInMonth(),
        )
        expect(dayjs(result.date).month()).toBe(dayjs(transaction.date).month())
        expect(dayjs(result.date).year()).toBe(dayjs(transaction.date).year())
    })
})
