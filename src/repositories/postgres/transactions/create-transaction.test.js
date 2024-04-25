import { faker } from '@faker-js/faker'
import { PostgresCreateTransactionRepository } from './create-transaction.js'
import { prisma } from '../../../../prisma/prisma.js'
import dayjs from 'dayjs'

describe('Create Transaction Repository', () => {
    const sut = new PostgresCreateTransactionRepository()

    const fakeUser = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    }

    const transaction = {
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        date: faker.date.anytime().toISOString(),
        amount: Number(faker.finance.amount()),
        type: 'EARNING',
    }

    it('should create a transaction on db', async () => {
        const user = await prisma.user.create({ data: fakeUser })
        const result = await sut.execute({ ...transaction, user_id: user.id })

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
