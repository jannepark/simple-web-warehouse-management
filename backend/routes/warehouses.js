import express from 'express';
import tokenExtractor from '../middlewares/tokenExtractor.js';
import {
  getWarehouses,
  createWarehouse,
  deleteWarehouse,
  updateWarehouse,
  getWarehouseById,
} from '../controllers/warehouses.js';

const router = express.Router();

router.get('/', tokenExtractor, getWarehouses);
router.get('/:id', tokenExtractor, getWarehouseById);
router.post('/', tokenExtractor, createWarehouse);
router.delete('/:id', tokenExtractor, deleteWarehouse);
router.put('/:id', tokenExtractor, updateWarehouse);

export default router;