// index.js
import urlParser from 'url'
import express from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { DISLIKE_ACTION_VALUE, LIKE_ACTION_VALUE } from '../configs/configs'

const prisma = new PrismaClient()
const app = express()

// eslint-disable-next-line import/no-named-as-default-member
app.use(express.json())

const tokenAuthorization = async (req) => {
  const token = req.header('authorization')

  return await jwt.verify(token, process.env.JWT_SECRET_KEY)
}

app.get('/me', async (req, res) => {
  try {
    res.json({ user: await tokenAuthorization(req) })
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
})

app.post('/actions', async (req, res) => {
  try {
    const user = await tokenAuthorization(req)
    const {
      action,
      movieId,
    } = req.body
    if (![LIKE_ACTION_VALUE, DISLIKE_ACTION_VALUE].includes(action)) {
      res.status(400).json({ message: 'Not allowed to do this!' })
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
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.get('/movies', async (req, res) => {
  try {
    let page = parseInt(req.query.page || 1)
    if (page < 1) {
      page = 1
    }
    const where = {}
    const isPrivate = req.query.isPrivate === 'true'

    if (isPrivate) {
      const user = await tokenAuthorization(req)
      where.user_id = user.id
    }

    const perPage = 5
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
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
})

app.post('/movies', async (req, res) => {
  try {
    const user = await tokenAuthorization(req)
    const fullUrl = req.body.url
    const url = new urlParser.URL(fullUrl)
    const id = url.searchParams.get('v')
    if (!id) {
      res.status(400).json({ message: 'Invalid url!' })
    }

    await prisma.movie.create({
      data: {
        user_id: user.id,
        full_url: fullUrl,
        video_id: id,
      },
    })

    res.json({ message: 'Successfully shared the video!' })
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
})

app.post('/register', async (req, res) => {
  try {
    const curUser = await prisma.user.findFirst({
      where: { username: req.body.username },
    })
    if (curUser) {
      return res.status(400).json({ message: 'Already exists user!' })
    }
    const hashPass = await bcrypt.hash(req.body.password, 10)
    await prisma.user.create({
      data: {
        username: req.body.username,
        password: hashPass,
      },
    })

    res.json({ message: 'Registered successfully!' })
  } catch (e) {
    res.status(400).json({ message: e.message })
  }
})

app.post('/login', async (req, res) => {
  try {
    const curUser = await prisma.user.findFirst({
      where: { username: req.body.username },
    })

    if (!curUser || !await bcrypt.compare(req.body.password, curUser.password)) {
      return res.status(400).json({ message: 'Login information is incorrect!' })
    }

    const token = await jwt.sign(
      curUser,
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: 12 * 60 * 60,
      },
    )

    res.json({
      message: 'Successfully logged in!',
      token,
      user: curUser,
    })
  } catch (e) {
    return res.status(400).json({ message: e.message })
  }
})

/**
 * logic for our api will go here
 */
export default {
  path: '/api',
  handler: app,
}
