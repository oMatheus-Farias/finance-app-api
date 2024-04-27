import validator from 'validator'
import { IdGeneratorAdapter } from './id-generator'

describe('Id Generator Adaoter', () => {
    const sut = new IdGeneratorAdapter()

    it('should return a random id', () => {
        const response = sut.execute()

        expect(response).toBeTruthy()
        expect(typeof response).toBe('string')
        expect(validator.isUUID(response)).toBe(true)
    })
})
