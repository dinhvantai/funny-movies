import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'

import prisma from '../services/PrismaService'
import UserService from '../services/UserService'
import * as configs from '../configs/configs'

class UserController {
  async login (req: Request, res: Response) {
    try {
      const curUser = await UserService.findByUserName(req.body.username)

      if (!curUser || !await UserService.checkPassword(req.body.password, curUser.password)) {
        return res.status(400).json({ message: 'Login information is incorrect!' })
      }

      const token = await jwt.sign(
        curUser,
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: configs.DEFAULT_TOKEN_EXPIRE,
        },
      )

      res.json({
        message: 'Successfully logged in!',
        token,
        user: curUser,
      })
    } catch (e: any) {
      return res.status(400).json({ message: e.message })
    }
  }

  async register (req: Request, res: Response) {
    try {
      const curUser = await prisma.user.findFirst({
        where: { username: req.body.username },
      })
      if (curUser) {
        return res.status(400).json({ message: 'Already exists user!' })
      }
      const hashPass = await UserService.hashPassword(req.body.password)
      await prisma.user.create({
        data: {
          username: req.body.username,
          password: hashPass,
        },
      })

      res.json({ message: 'Registered successfully!' })
    } catch (e: any) {
      res.status(400).json({ message: e.message })
    }
  }

  me (req: Request, res: Response) {
    // @ts-ignore
    res.json({ user: req.user })
  }
}

export default new UserController()
