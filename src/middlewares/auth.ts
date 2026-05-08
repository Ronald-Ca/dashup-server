import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { responseError, responseSuccess } from '../utils/jsonResponse'
import { PrismaService } from "../../prisma/prismaService"

export default async function Auth(req: Request, res: Response, next: NextFunction) {
    const authSecret = <string>process.env.AUTH_SECRET
    try {
        const authHeader = req.headers.authorization

        if (!authHeader) {
            return res.status(401).json(responseError(['Token not provided'], null, 401))
        }

        const parts = authHeader.split(' ')
        if (parts.length !== 2) {
            return res.status(401).json(responseError(['Token malformatted'], null, 401))
        }

        const [scheme, token] = parts
        if (!/^Bearer$/i.test(scheme)) {
            return res.status(401).json(responseError(['Token malformatted'], null, 401))
        }

        if (authSecret) {
            try {
                const decoded = <JwtPayload>jwt.verify(token, authSecret)
                if (!decoded) return res.status(401).json(responseError(['Token invalid'], null, 401))
                const response = await PrismaService.user.findUnique({ where: { id: decoded.id } })
                if (!response) return res.status(401).json(responseError(['User not found!'], null, 401))
                if (!response.active) return res.status(401).json(responseError(['User not active!'], null, 401))
                return next()
            } catch (err) {
                return res.status(401).json(responseError(['Token invalid'], null, 401))

            }
        } else {
            return res.status(401).json(responseError(['An error occurred contact support'], null, 401))
        }
    } catch (err) {
        return res.status(401).json(responseError(['An error occurred contact support'], null, 401))
    }
}