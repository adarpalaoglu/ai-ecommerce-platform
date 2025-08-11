import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'; // Assuming jsonwebtoken is used for JWT
import { AppError } from '../utils/AppError'; // Assuming AppError exists

interface AuthenticatedRequest extends Request {
  user?: { id: string; roles: string[]; }; // Extend Request to include user info
}

export const authMiddleware = (requiredRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      // Get token from header
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return next(new AppError('Authentication token missing', 401));
      }

      // Verify token (replace 'your_jwt_secret' with actual secret from config)
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as { id: string; roles: string[]; };

      req.user = decoded; // Attach user info to request

      // Check for roles
      const hasRequiredRole = requiredRoles.some(role => req.user?.roles.includes(role));

      if (!hasRequiredRole) {
        return next(new AppError('Forbidden: Insufficient role permissions', 403));
      }

      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return next(new AppError('Invalid or expired token', 401));
      }
      next(error); // Pass other errors to global error handler
    }
  };
};
