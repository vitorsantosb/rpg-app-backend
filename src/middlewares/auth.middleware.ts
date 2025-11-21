import { Request, Response, NextFunction } from 'express';
import JwtUtils from '@security/jwt-utils';
import GetApiUrl from '@services/url.service';

/**
 * Middleware para autenticação via JWT no header Authorization
 * Extrai o token do header, decodifica e adiciona os dados do usuário ao req
 */
export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // Pega o token do header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).send({
        message: 'Authorization header is missing',
        statusCode: 401,
        request: {
          method: req.method,
          description: 'Authentication required',
          url: `${GetApiUrl()}${req.path}`
        }
      });
    }

    // Verifica se o header está no formato "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).send({
        message: 'Invalid authorization header format. Expected: Bearer <token>',
        statusCode: 401,
        request: {
          method: req.method,
          description: 'Authentication required',
          url: `${GetApiUrl()}${req.path}`
        }
      });
    }

    const token = parts[1];

    // Decodifica o JWT e extrai os dados do usuário
    try {
      const payload = JwtUtils.DecodedUserJwtPayload(token);
      
      // Adiciona os dados do usuário ao request para uso nas rotas
      (req as any).user = payload;
      (req as any).userId = payload._id;
      
      next();
    } catch (error) {
      return res.status(403).send({
        message: 'Invalid or expired token',
        statusCode: 403,
        request: {
          method: req.method,
          description: 'Token is expired or invalid!',
          url: `${GetApiUrl()}${req.path}`
        }
      });
    }
  } catch (error) {
    return res.status(500).send({
      message: 'Internal server error during authentication',
      statusCode: 500,
      request: {
        method: req.method,
        description: 'Error processing authentication',
        url: `${GetApiUrl()}${req.path}`
      }
    });
  }
}

