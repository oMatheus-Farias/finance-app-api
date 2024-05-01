import { faker } from '@faker-js/faker'
import request from 'supertest'
import { app } from '../app.cjs'
import { TransactionType } from '@prisma/client'

describe('Transaction Routes E2E Tests', () => {
    it('POST /api/transactions should return 201 when creating a transaction successfully', async () => {
        const { body: createdUser } = await request(app)
            .post('/api/users')
            .send({
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 7,
                }),
            })

        const result = await request(app).post('/api/transactions').send({
            user_id: createdUser.id,
            name: faker.finance.accountName(),
            date: faker.date.anytime().toISOString(),
            amount: 2000,
            type: TransactionType.INVESTMENT,
        })

        expect(result.status).toBe(201)
        expect(result.body.user_id).toBe(createdUser.id)
    })
})
