import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import rootRouter from './routes';
import { errorHandler } from './common/middlewares/error.middleware';
import { AppError } from './common/errors/AppError';

const app: Application = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Root Router
app.use('/api', rootRouter);

// 404 Handler
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new AppError('Resource not found', 404, 'NOT_FOUND'));
});

// Global Error Handler
app.use(errorHandler);

export default app;
