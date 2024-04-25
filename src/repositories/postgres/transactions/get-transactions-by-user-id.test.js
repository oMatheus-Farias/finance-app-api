import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma.js'
import { PostgresGetTransactionsByUserIdRepository } from './get-transactions-by-user-id.js'
import dayjs from 'dayjs'

describe('Postgres Get Transactions By User Id Repository', () => {
    const sut = new PostgresGetTransactionsByUserIdRepository()

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

    it('should get transactions by user id on db', async () => {
        const user = await prisma.user.create({ data: userParams })
        const transaction = await prisma.transaction.create({
            data: {
                ...transactionParams,
                user_id: user.id,
            },
        })

        const result = await sut.execute(user.id)

        expect(result.length).toBe(1)
        expect(result[0]).not.toBeNull()
        expect(result[0].type).toBe(transaction.type)
        expect(result[0].name).toBe(transaction.name)
        expect(result[0].user_id).toBe(user.id)
        expect(String(result[0].amount)).toBe(String(transaction.amount))
        expect(dayjs(result[0].date).daysInMonth()).toBe(
            dayjs(transaction.date).daysInMonth(),
        )
        expect(dayjs(result[0].date).month()).toBe(
            dayjs(transaction.date).month(),
        )
        expect(dayjs(result[0].date).year()).toBe(
            dayjs(transaction.date).year(),
        )
    })
})
