import { faker } from '@faker-js/faker'

import { PostgresDeleteUserRepository } from './delete-user.js'
import { prisma } from '../../../../prisma/prisma.js'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { UserNotFoundError } from '../../../errors/user.js'

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

    it('should call Prisma with correct params', async () => {
        await prisma.user.create({ data: user })
        const spyPrisma = jest.spyOn(prisma.user, 'delete')

        await sut.execute(user.id)

        expect(spyPrisma).toHaveBeenCalledWith({
            where: {
                id: user.id,
            },
        })
    })

    it('should throw generic error if Prisma throws generic error', async () => {
        jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(new Error())

        const response = sut.execute(user.id)

        await expect(response).rejects.toThrow()
    })

    it('should throw TransactionNotFoundError if Prisma throws TransactionNotFoundError', async () => {
        jest.spyOn(prisma.user, 'delete').mockRejectedValueOnce(
            new PrismaClientKnownRequestError('', {
                code: 'P2025',
            }),
        )

        const response = sut.execute(user.id)

        await expect(response).rejects.toThrow(new UserNotFoundError(user.id))
    })
})
