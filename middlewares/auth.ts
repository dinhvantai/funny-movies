import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { prisma } from '../services/PrismaService'

export const getUserFromRequest = async (req: Request): Promise<any> => {
  const token = req.header('authorization') || ''

  const result: any = await jwt.verify(token, process.env.JWT_SECRET_KEY || '')
  const id = result?.id
  const user = prisma.user.findFirst({ where: { id } })

  if (!user) {
    throw new Error('No user!')
  }

  return user
}

export default async function (req: Request, res: Response, next: NextFunction) {
  try {
    // @ts-ignore
    req.user = await getUserFromRequest(req)
    next()
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized!' })
  }
}
