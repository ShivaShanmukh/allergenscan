import { Router } from 'express';
import authRoutes from './auth';
import scanRoutes from './scan';

const router = Router();

router.use('/auth', authRoutes);
router.use('/scan', scanRoutes);

export default router;
