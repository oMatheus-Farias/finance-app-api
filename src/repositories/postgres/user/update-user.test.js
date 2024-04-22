import { faker } from '@faker-js/faker'
import { PostgresUpdateUserRepository } from './update-user.js'
import { prisma } from '../../../../prisma/prisma.js'

describe('Postgres Update User Repository', () => {
    const fakeUser = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    }

    const updateUserParams = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    }

    const sut = new PostgresUpdateUserRepository()

    it('should update user on db', async () => {
        const user = await prisma.user.create({ data: fakeUser })

        const result = await sut.execute(user.id, updateUserParams)

        expect(result).toStrictEqual(updateUserParams)
    })
})
