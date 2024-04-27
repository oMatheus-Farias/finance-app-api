import { DeleteUserController, UpdateUserController } from '../../controllers'
import { makeDeleteUserController, makeUpdateUserController } from './user'

describe('User Controllers Factories', () => {
    it('should return a valid UpdateUserController instance', () => {
        expect(makeUpdateUserController()).toBeInstanceOf(UpdateUserController)
    })

    it('should return a valid DeleteUserController instance', () => {
        expect(makeDeleteUserController()).toBeInstanceOf(DeleteUserController)
    })
})
