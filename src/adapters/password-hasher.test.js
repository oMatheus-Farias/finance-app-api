import { faker } from '@faker-js/faker'
import { PasswordHasherAdapter } from './password-hasher'

describe('Password Hasher Adapter', () => {
    const sut = new PasswordHasherAdapter()

    it('should return a hashed password', async () => {
        const password = faker.internet.password()

        const result = await sut.execute(password)

        expect(result).toBeTruthy()
        expect(typeof result).toBe('string')
        expect(result).not.toBe(password)
    })
})
