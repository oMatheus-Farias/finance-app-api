import { faker } from '@faker-js/faker'
import { PostgresGetUserByIdRepository } from './get-user-by-id.js'
import { prisma } from '../../../../prisma/prisma.js'

describe('Postgres Get User By Id Repository', () => {
    const sut = new PostgresGetUserByIdRepository()

    const fakeUser = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    }

    it('should get user by id a db', async () => {
        const user = await prisma.user.create({ data: fakeUser })

        const result = await sut.execute(user.id)

        expect(result).toStrictEqual(fakeUser)
    })

    it('should call Prisma with correct params', async () => {
        const prismaSpy = import.meta.jest.spyOn(prisma.user, 'findUnique')

        await sut.execute(fakeUser.id)

        expect(prismaSpy).toHaveBeenCalledWith({
            where: {
                id: fakeUser.id,
            },
        })
    })

    it('should throw if Prisma throws', async () => {
        import.meta.jest
            .spyOn(prisma.user, 'findUnique')
            .mockRejectedValueOnce(new Error())

        const result = sut.execute(fakeUser.id)

        await expect(result).rejects.toThrow()
    })
})
