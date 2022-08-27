import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export const getUserFromRequest = async (req: Request) => {
  const token = req.header('authorization')

  return await jwt.verify(token, process.env.JWT_SECRET_KEY)
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
