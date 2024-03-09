import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'

import { PostgresCreateUserRepository } from '../repositories/postgres/create-user.js'

export class CreateUserUseCase {
  async execute(createUserParams) {
    //TODO: Verificar se  e-mail já está em uso

    //Gerar ID do usuário
    const userId = uuidv4()

    //Criptografar a senha
    const hashedPassword = await bcrypt.hash(createUserParams.password, 10)

    //Inserir o usuário no banco de dados
    const user = {
      ...createUserParams,
      id: userId,
      password: hashedPassword,
    }

    //Chamar o repositório
    const postgresCreateUserRepositories = new PostgresCreateUserRepository()

    const createUser = await postgresCreateUserRepositories.execute(user)

    return createUser
  }
}
