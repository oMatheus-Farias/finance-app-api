import { UpdateUserController } from '../../controllers'
import { makeUpdateUserController } from './user'

describe('User Controllers Factories', () => {
    it('should return a valid UpdateUserController instance', () => {
        expect(makeUpdateUserController()).toBeInstanceOf(UpdateUserController)
    })
})
