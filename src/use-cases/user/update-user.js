import { EmailAlreadyInUseError } from '../../errors/user.js'

import bcrypt from 'bcryptjs'

export class UpdateUserUseCase {
  constructor(getUserByEmailRepository, updateUserRepository) {
    this.getUserByEmailRepository = getUserByEmailRepository
    this.updateUserRepository = updateUserRepository
  }

  async execute(userId, updateUserParams) {
    const userWithProvidedEmail = await this.getUserByEmailRepository.execute(
      updateUserParams.email,
    )

    if (userWithProvidedEmail && userWithProvidedEmail.id !== userId) {
      throw new EmailAlreadyInUseError(updateUserParams.email)
    }

    const user = {
      ...updateUserParams,
    }

    if (updateUserParams.password) {
      const hashedPassword = await bcrypt.hash(updateUserParams.password, 10)

      user.password = hashedPassword
    }

    const updatedUser = await this.updateUserRepository.execute(userId, user)

    return updatedUser
  }
}