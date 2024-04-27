import { faker } from '@faker-js/faker'
import request from 'supertest'
import { app } from '../app.js'
describe('User Routes E2E Tests', () => {
    it('POST /api/users should return 201 when user is created', async () => {
        const response = await request(app)
            .post('/api/users')
            .send({
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 7,
                }),
            })

        expect(response.status).toBe(201)
    })

    it('GET /api/users/:userId should return 200 when user is found', async () => {
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

        const result = await request(app).get(`/api/users/${createdUser.id}`)

        expect(result.status).toBe(200)
        expect(result.body.first_name).toBe(createdUser.first_name)
        expect(result.body.last_name).toBe(createdUser.last_name)
        expect(result.body.email).toBe(createdUser.email)
    })

    it('PATCH /api/users/:userId should return 200 when user is updated', async () => {
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

        const result = await request(app)
            .patch(`/api/users/${createdUser.id}`)
            .send({
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password({
                    length: 7,
                }),
            })

        expect(result.status).toBe(200)
        expect(result.body.first_name).not.toBe(createdUser.first_name)
        expect(result.body.last_name).not.toBe(createdUser.last_name)
        expect(result.body.email).not.toBe(createdUser.email)
        expect(createdUser.password).not.toBe(result.body.password)
    })
})
