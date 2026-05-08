import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import InternalError from '../utils/internalError';
import { responseError } from '../utils/jsonResponse';
import { Prisma } from '@prisma/client';

export default function errorHandler(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (error instanceof InternalError) {
        return res.status(error.statusCode || 400).json(
            responseError(
                Array.isArray(error.erros) ? error.erros : [error.message],
                null,
                error.statusCode || 400
            )
        );
    }

    if (error instanceof ZodError) {
        const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
        return res.status(400).json(responseError(errors, null, 400));
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            return res.status(409).json(
                responseError(['Registro duplicado. Este valor já existe.'], null, 409)
            );
        }
        if (error.code === 'P2025') {
            return res.status(404).json(
                responseError(['Registro não encontrado.'], null, 404)
            );
        }
        return res.status(400).json(
            responseError([`Erro no banco de dados: ${error.message}`], null, 400)
        );
    }

    console.error('Unhandled error:', error);
    return res.status(500).json(
        responseError(['Erro interno do servidor'], null, 500)
    );
}

