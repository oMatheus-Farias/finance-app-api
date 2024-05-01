import { faker } from '@faker-js/faker'
import { PostgresUpdateUserRepository } from './update-user.js'
import { prisma } from '../../../../prisma/prisma.js'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { UserNotFoundError } from '../../../errors/user.js'

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

    it('should call Prisma with correct params', async () => {
        const user = await prisma.user.create({ data: fakeUser })
        const prismaSpy = import.meta.jest.spyOn(prisma.user, 'update')

        await sut.execute(user.id, updateUserParams)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: user.id,
            },
            data: updateUserParams,
        })
    })

    it('should throw if Prisma throws', async () => {
        import.meta.jest
            .spyOn(prisma.user, 'update')
            .mockRejectedValueOnce(new Error())

        const result = sut.execute(fakeUser.id)

        await expect(result).rejects.toThrow()
    })

    it('should throw generic error if Prisma throws generic error', async () => {
        import.meta.jest
            .spyOn(prisma.user, 'update')
            .mockRejectedValueOnce(new Error())

        const response = sut.execute(fakeUser.id)

        await expect(response).rejects.toThrow()
    })

    it('should throw UserNotFoundError if Prisma throws UserNotFoundError', async () => {
        import.meta.jest.spyOn(prisma.user, 'update').mockRejectedValueOnce(
            new PrismaClientKnownRequestError('', {
                code: 'P2025',
            }),
        )

        const response = sut.execute(fakeUser.id)

        await expect(response).rejects.toThrow(
            new UserNotFoundError(fakeUser.id),
        )
    })
})
