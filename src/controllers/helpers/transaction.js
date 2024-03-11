import validator from 'validator'

import { badRequest } from './index.js'

export const checkIfAmountIsvalid = (amount) =>
  validator.isCurrency(amount.toString(), {
    digits_after_decimal: [2],
    allow_negatives: false,
    decimal_separator: '.',
  })

export const checkIfTypeIsValid = (type) =>
  ['EARNING', 'EXPENSE', 'INVESTMENT'].includes(type)

export const invalidAmoundResponse = () =>
  badRequest({ message: `The amount must a be a valid currency.` })

export const invalidTypeResponse = () =>
  badRequest({
    message: `The type must be EARNING, EXPENSE or INVESTMENT.`,
  })
