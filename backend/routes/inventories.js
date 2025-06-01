import express from 'express';
import {
  getItemsAndInventories,
  createInventory,
  updateItem,
  deleteInventory,
  updateInventory,
  getInventoryByLocation,
  createItem, 
  deleteItem
} from '../controllers/inventories.js';
import tokenExtractor from '../middlewares/tokenExtractor.js';

const router = express.Router();
router.get('/', tokenExtractor, getItemsAndInventories);
router.get('/:id', tokenExtractor, getInventoryByLocation);
router.post('/', tokenExtractor, createInventory); 
router.delete('/:id', tokenExtractor, deleteInventory);
router.put('/:id', tokenExtractor, updateInventory); 
router.put('/item/:id', tokenExtractor, updateItem);
router.post('/item', tokenExtractor, createItem) 
router.delete('/item/:id', tokenExtractor, deleteItem);

export default router;




