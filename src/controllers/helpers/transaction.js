import { notFound } from './index.js'

export const transactionNotFoundResponse = () =>
    notFound({ message: `Transaction not found.` })
