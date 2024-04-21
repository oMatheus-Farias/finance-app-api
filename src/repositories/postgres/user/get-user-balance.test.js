import { faker } from '@faker-js/faker'
import { PostgresGetUserBalanceRepository } from './get-user-balance.js'
import { prisma } from '../../../../prisma/prisma'

describe('Get User Balance Repository', () => {
    const fakeUser = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    }

    const sut = new PostgresGetUserBalanceRepository()

    it('should get user balance on db', async () => {
        const user = await prisma.user.create({
            data: fakeUser,
        })

        await prisma.transaction.createMany({
            data: [
                {
                    name: faker.finance.accountName(),
                    date: faker.date.anytime().toISOString(),
                    amount: 5000,
                    type: 'EARNING',
                    user_id: user.id,
                },
                {
                    name: faker.finance.accountName(),
                    date: faker.date.anytime().toISOString(),
                    amount: 5000,
                    type: 'EARNING',
                    user_id: user.id,
                },
                {
                    name: faker.finance.accountName(),
                    date: faker.date.anytime().toISOString(),
                    amount: 1000,
                    type: 'EXPENSE',
                    user_id: user.id,
                },
                {
                    name: faker.finance.accountName(),
                    date: faker.date.anytime().toISOString(),
                    amount: 1000,
                    type: 'EXPENSE',
                    user_id: user.id,
                },
                {
                    name: faker.finance.accountName(),
                    date: faker.date.anytime().toISOString(),
                    amount: 3000,
                    type: 'INVESTMENT',
                    user_id: user.id,
                },
                {
                    name: faker.finance.accountName(),
                    date: faker.date.anytime().toISOString(),
                    amount: 3000,
                    type: 'INVESTMENT',
                    user_id: user.id,
                },
            ],
        })

        const result = await sut.execute(user.id)

        expect(result.earnings.toString()).toBe('10000')
        expect(result.expenses.toString()).toBe('2000')
        expect(result.investments.toString()).toBe('6000')
        expect(result.balance.toString()).toBe('2000')
    })
})
