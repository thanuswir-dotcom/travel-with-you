import { Router } from 'express';
import healthRouter from './health.routes.js';
import placesRouter from './places.routes.js';
import weatherRouter from './weather.routes.js';
import aiRouter from './ai.routes.js';
import savedRouter from './saved.routes.js';
import tripsRouter from './trips.routes.js';
import expensesRouter from './expenses.routes.js';
import memoriesRouter from './memories.routes.js';
import authRouter from './auth.routes.js';

const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/places', placesRouter);
apiRouter.use('/weather', weatherRouter);
apiRouter.use('/ai', aiRouter);
apiRouter.use('/saved', savedRouter);
apiRouter.use('/trips', tripsRouter);
apiRouter.use('/expenses', expensesRouter);
apiRouter.use('/memories', memoriesRouter);
apiRouter.use('/auth', authRouter);

export default apiRouter;
