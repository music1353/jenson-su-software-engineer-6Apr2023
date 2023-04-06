import { Request, Response, NextFunction } from 'express';

const checkLogin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session || !req.session.uid) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

export { checkLogin };