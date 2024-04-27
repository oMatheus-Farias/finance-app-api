import { Router } from 'express'

import {
    makeCreateTransactionController,
    makeGetTransactionsByUserIdController,
    makeUpdateTransactionController,
    makeDeleteTransactionConttroller,
} from '../factories/controllers/index.js'

export const transactionsRouter = Router()

transactionsRouter.get('/', async (req, res) => {
    const getTransactionsByUserIdController =
        makeGetTransactionsByUserIdController()

    const { statusCode, body } =
        await getTransactionsByUserIdController.execute(req)

    res.status(statusCode).json(body)
})

transactionsRouter.post('/', async (req, res) => {
    const createTransactionController = makeCreateTransactionController()

    const { statusCode, body } = await createTransactionController.execute(req)

    res.status(statusCode).json(body)
})

transactionsRouter.patch('/:transactionId', async (req, res) => {
    const updateTransactionController = makeUpdateTransactionController()

    const { statusCode, body } = await updateTransactionController.execute(req)

    res.status(statusCode).json(body)
})

transactionsRouter.delete('/:transactionId', async (req, res) => {
    const deleteTransactionController = makeDeleteTransactionConttroller()

    const { statusCode, body } = await deleteTransactionController.execute(req)

    res.status(statusCode).json(body)
})
