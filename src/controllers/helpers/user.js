import { badRequest } from './http.js'
import validator from 'validator'

export const invalidPasswordResponse = () =>
  badRequest({
    message: 'Password must be at least 6 characters.',
  })

export const emailAlreadyInUseResponse = () =>
  badRequest({
    message: 'Invalid e-mail. Please provide a valid one.',
  })

export const invalidIdResponse = () =>
  badRequest({
    message: 'The provided id is not valid. Please provide a valid id.',
  })

export const checkIfPasswordIsInvalid = (password) => password.length < 6

export const checkIfEmailIsInvalid = (email) => validator.isEmail(email)

export const checkIfIdIsValid = (id) => validator.isUUID(id)
