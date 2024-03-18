import bcrypt from 'bcryptjs'

export class PasswordHasherAdapter {
  execute(password) {
    return bcrypt.hash(password, 10)
  }
}
