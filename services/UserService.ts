import bcrypt from 'bcrypt'

import { DEFAULT_SALT_ROUNDS } from '../configs/configs'
import PrismaService from './PrismaService'

class UserService {
  async findByUserName (username: string): Promise<any> {
    return await PrismaService.user.findFirst({
      where: { username },
    })
  }

  async hashPassword (password: string): Promise<string> {
    return await bcrypt.hash(password, DEFAULT_SALT_ROUNDS)
  }

  async checkPassword (raw: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(raw, hash)
  }
}

export default new UserService()
