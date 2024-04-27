import { CreateTransactionController } from '../../controllers'
import { makeCreateTransactionController } from './transaction'

describe('Transaction Controllers Factories', () => {
    it('should return a valid CreateTransactionController instance', () => {
        expect(makeCreateTransactionController()).toBeInstanceOf(
            CreateTransactionController,
        )
    })
})
