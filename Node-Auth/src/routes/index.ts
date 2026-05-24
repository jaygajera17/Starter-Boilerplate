import { Router } from 'express';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import { apiLimiter as rateLimiter } from '../utils/rateLimiter';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

const routes: Array<{ path: string; router: Router; requiresAuth: boolean }> = [
  { path: '/users', router: userRoutes, requiresAuth: true },
  { path: '/auth', router: authRoutes, requiresAuth: false },
];

routes.forEach((route) => {
  if (route.requiresAuth) {
    router.use(route.path, authMiddleware, rateLimiter, route.router);
  } else {
    router.use(route.path, rateLimiter, route.router);
  }
});

export default router;
