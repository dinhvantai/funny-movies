import urlParser from 'url'
import { Request, Response } from 'express'

import { prisma } from '../services/PrismaService'
import { DEFAULT_PER_PAGE_QUERY } from '../configs/configs'
import { getUserFromRequest } from '../middlewares/auth'

class MovieController {
  async index (req: Request, res: Response) {
    try {
      // @ts-ignore
      let page = parseInt(req.query.page || 1)
      if (page < 1) {
        page = 1
      }
      const where: any = {}
      const isPrivate = req.query.isPrivate === 'true'

      if (isPrivate) {
        const user = await getUserFromRequest(req)
        where.user_id = user.id || ''
      }

      const perPage = DEFAULT_PER_PAGE_QUERY
      const movies = await prisma.movie.findMany({
        take: perPage,
        skip: (page - 1) * perPage,
        where,
        orderBy: { id: 'desc' },
        include: {
          user: true,
          actions: true,
        },
      })

      const aggregations = await prisma.movie.aggregate({
        _count: { id: true },
        where,
      })

      res.json({
        movies,
        meta: {
          page,
          total: aggregations._count.id,
          perPage,
        },
      })
    } catch (e: any) {
      res.status(400).json({ message: e.message })
    }
  }

  async create (req: Request, res: Response) {
    try {
      // @ts-ignore
      const { user } = req
      const fullUrl = req.body.url
      const url = new urlParser.URL(fullUrl)
      const id = url.searchParams.get('v') || ''
      if (!id) {
        return res.status(400).json({ message: 'Invalid url!' })
      }

      await prisma.movie.create({
        data: {
          user_id: user.id,
          full_url: fullUrl,
          video_id: id,
        },
      })

      return res.json({ message: 'Successfully shared the video!' })
    } catch (e: any) {
      return res.status(400).json({ message: e.message })
    }
  }
}

export default new MovieController()
