import { faker } from '@faker-js/faker'

import { PostgresDeleteUserRepository } from './delete-user.js'
import { prisma } from '../../../../prisma/prisma.js'

describe('Delete User Repository', () => {
    const user = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    }

    const sut = new PostgresDeleteUserRepository()

    it('should delete a user on db', async () => {
        await prisma.user.create({
            data: user,
        })

        const result = await sut.execute(user.id)

        expect(result.id).toStrictEqual(user.id)
    })
})
