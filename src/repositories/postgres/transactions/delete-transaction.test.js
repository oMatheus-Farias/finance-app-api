import { faker } from '@faker-js/faker'
import { PostgresDeleteTransactionRepository } from './delete-transaction.js'
import { prisma } from '../../../../prisma/prisma.js'
import dayjs from 'dayjs'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { TransactionNotFoundError } from '../../../errors/transaction.js'

describe('Postgres Delete Transaction Repository', () => {
    const sut = new PostgresDeleteTransactionRepository()

    const userParams = {
        id: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password({
            length: 7,
        }),
    }

    const transactionParams = {
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        date: faker.date.anytime().toISOString(),
        amount: Number(faker.finance.amount()),
        type: 'EARNING',
    }

    it('should delete a transaction on db', async () => {
        const user = await prisma.user.create({ data: userParams })
        const transaction = await prisma.transaction.create({
            data: {
                ...transactionParams,
                user_id: user.id,
            },
        })

        const result = await sut.execute(transaction.id)

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

    it('should call Prisma with correct params', async () => {
        const user = await prisma.user.create({ data: userParams })
        const spyPrisma = import.meta.jest.spyOn(prisma.transaction, 'delete')
        const transaction = await prisma.transaction.create({
            data: {
                ...transactionParams,
                user_id: user.id,
            },
        })

        await sut.execute(transaction.id)

        expect(spyPrisma).toHaveBeenCalledWith({
            where: {
                id: transaction.id,
            },
        })
    })

    it('should throw generic error if Prisma throws generic error', async () => {
        import.meta.jest
            .spyOn(prisma.transaction, 'delete')
            .mockRejectedValueOnce(new Error())

        const response = sut.execute(transactionParams.id)

        await expect(response).rejects.toThrow()
    })

    it('should throw TransactionNotFoundError if Prisma throws TransactionNotFoundError', async () => {
        import.meta.jest
            .spyOn(prisma.transaction, 'delete')
            .mockRejectedValueOnce(
                new PrismaClientKnownRequestError('', {
                    code: 'P2025',
                }),
            )

        const response = sut.execute(transactionParams.id)

        await expect(response).rejects.toThrow(
            new TransactionNotFoundError(transactionParams.id),
        )
    })
})
