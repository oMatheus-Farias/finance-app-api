import { badRequest } from './index.js'
import validator from 'validator'

export const checkIfIdIsValid = (id) => validator.isUUID(id)

export const invalidIdResponse = () =>
  badRequest({
    message: 'The provided id is not valid. Please provide a valid id.',
  })

export const requiredFieldIsMissingResponse = (field) => {
  return badRequest({
    message: `The field ${field} is required.`,
  })
}

export const checkIfIsString = (value) => typeof value === 'string'

export const validateRequiredFields = (params, requiredFields) => {
  for (const field of requiredFields) {
    const fieldIsMissing = !params[field]
    const fieldIsEmpty =
      checkIfIsString(params[field]) &&
      validator.isEmpty(params[field], {
        ignore_whitespace: true,
      })

    if (fieldIsMissing || fieldIsEmpty) {
      return {
        missingField: field,
        ok: false,
      }
    }
  }

  return {
    missingField: undefined,
    ok: true,
  }
}
