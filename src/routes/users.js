import { Router } from 'express'

import {
    makeCreateUserController,
    makeDeleteUserController,
    makeGetUserByIdController,
    makeUpdateUserController,
    makeGetUserBalanceController,
} from '../factories/controllers/index.js'

export const usersRouter = Router()

usersRouter.get('/:userId', async (req, res) => {
    const getUserByIdController = makeGetUserByIdController()

    const { statusCode, body } = await getUserByIdController.execute(req)

    res.status(statusCode).json(body)
})

usersRouter.get('/:userId/balance', async (req, res) => {
    const getUserBalanceController = makeGetUserBalanceController()

    const { statusCode, body } = await getUserBalanceController.execute(req)

    res.status(statusCode).json(body)
})

usersRouter.post('/', async (req, res) => {
    const createUserController = makeCreateUserController()

    const { statusCode, body } = await createUserController.execute(req)

    res.status(statusCode).json(body)
})

usersRouter.patch('/:userId', async (req, res) => {
    const updateUserController = makeUpdateUserController()

    const { statusCode, body } = await updateUserController.execute(req)

    res.status(statusCode).json(body)
})

usersRouter.delete('/api/users/:userId', async (req, res) => {
    const deleteUserController = makeDeleteUserController()

    const { statusCode, body } = await deleteUserController.execute(req)

    res.status(statusCode).json(body)
})
