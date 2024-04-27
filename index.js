import 'dotenv/config.js'
import express from 'express'

import {
    makeCreateTransactionController,
    makeGetTransactionsByUserIdController,
    makeUpdateTransactionController,
    makeDeleteTransactionConttroller,
} from './src/factories/controllers/index.js'
import { usersRouter } from './src/routes/user.js'

const app = express()

app.use(express.json())

app.use('/api/users', usersRouter)

app.get('/api/transactions', async (req, res) => {
    const getTransactionsByUserIdController =
        makeGetTransactionsByUserIdController()

    const { statusCode, body } =
        await getTransactionsByUserIdController.execute(req)

    res.status(statusCode).json(body)
})

app.post('/api/transactions', async (req, res) => {
    const createTransactionController = makeCreateTransactionController()

    const { statusCode, body } = await createTransactionController.execute(req)

    res.status(statusCode).json(body)
})

app.patch('/api/transactions/:transactionId', async (req, res) => {
    const updateTransactionController = makeUpdateTransactionController()

    const { statusCode, body } = await updateTransactionController.execute(req)

    res.status(statusCode).json(body)
})

app.delete('/api/transactions/:transactionId', async (req, res) => {
    const deleteTransactionController = makeDeleteTransactionConttroller()

    const { statusCode, body } = await deleteTransactionController.execute(req)

    res.status(statusCode).json(body)
})

app.listen(process.env.PORT, () =>
    console.log(`listening on port ${process.env.PORT}`),
)
