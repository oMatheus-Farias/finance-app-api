import { notFound } from './index.js'

export const userNotFoundResponse = () =>
  notFound({ message: 'User not found.' })
