import { NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

export const getUserFromRequest = async (req: Request): Promise<JwtPayload> => {
  const token = req.header('authorization') || ''

  const result = await jwt.verify(token, process.env.JWT_SECRET_KEY || '')
  if (typeof result === 'string') {
    return { result }
  }

  return result
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
