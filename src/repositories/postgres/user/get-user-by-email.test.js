import { faker } from '@faker-js/faker'
import { prisma } from '../../../../prisma/prisma'
import { PostgresGetUserByEmailRepository } from './get-user-by-email'

describe('Get User By Email Repository', () => {
    const sut = new PostgresGetUserByEmailRepository()

    const fakeUser = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    }

    it('should get user by email on db', async () => {
        const user = await prisma.user.create({ data: fakeUser })

        const result = await sut.execute(user.email)

        expect(result).toStrictEqual(fakeUser)
    })
})
