import { Request, Response } from 'express'
import { prisma } from '../services/PrismaService'
import * as configs from '../configs/configs'

class ActionController {
  async create (req: Request, res: Response) {
    try {
      // @ts-ignore
      const { user } = req
      const {
        action,
        movieId,
      } = req.body

      if (![configs.LIKE_ACTION_VALUE, configs.DISLIKE_ACTION_VALUE].includes(action)) {
        res.status(403).json({ message: 'Not allowed to do this!' })
      }

      const where = {
        movie_id: movieId,
        user_id: user.id,
      }

      const curAct = await prisma.action.findFirst({ where })

      if (curAct && curAct.action === action) {
        await prisma.action.delete({ where: { id: curAct.id } })

        return res.json({ message: 'Successfully!' })
      }

      await prisma.action.upsert({
        where: { id: curAct?.id || 0 },
        update: {
          ...where,
          action,
        },
        create: {
          ...where,
          action,
        },
      })

      res.json({ message: 'Successfully!' })
    } catch (e: any) {
      res.status(400).json({ message: e.message })
    }
  }
}

export default new ActionController()
