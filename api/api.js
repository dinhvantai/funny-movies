// index.js
import express from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const app = express()

// eslint-disable-next-line import/no-named-as-default-member
app.use(express.json())

app.get('/me', async (req, res) => {
  try {
    const token = req.header('authorization')
    const user = await jwt.verify(token, process.env.JWT_SECRET_KEY)

    res.json({
      message: 'Registered successfully!',
      user,
    })
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
