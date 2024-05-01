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
