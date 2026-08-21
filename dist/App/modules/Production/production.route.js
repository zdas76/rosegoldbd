import express from 'express';
import { ProductionController } from './production.controller';
const router = express.Router();
router.get('/production', ProductionController.getProduction);
router.post('/production', ProductionController.createProduction);
router.put('/production/:id', ProductionController.updateProduction);
router.delete('/production/:id', ProductionController.deleteProduction);
export const ProductionRouter = router;
