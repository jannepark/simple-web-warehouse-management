import { useState, useCallback } from 'react';
import inventoryService from '../services/inventory';

export const useInventoryActions = (token, handleLogout) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchInventoryItems = useCallback(
    async (locationId) => {
      setLoading(true);
      try {
        const items = await inventoryService.getInventoryByLocation(token, locationId, handleLogout);
        return items;
      } catch (err) {
        console.error(err);
        throw new Error('Error fetching inventory items');
      } finally {
        setLoading(false);
      }
    },
    [token, handleLogout]
  );

  const handleEditSave = async (editItem, refreshInventory, handleEditClose) => {
    try {
      if (editItem.name.trim() === '') {
        setErrorMessage('Item name is required');
        return;
      }
      setLoading(true);
      await inventoryService.updateItem(token, editItem, handleLogout);
      await refreshInventory();
      handleEditClose();
      setErrorMessage('');
    } catch (err) {
      console.error(err);
      throw new Error('Could not update item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (inventoryId, refreshInventory) => {
    if (!inventoryId) {
      console.error('Inventory ID is undefined');
      return;
    }
    try {
      setLoading(true);
      await inventoryService.deleteInventory(token, inventoryId, handleLogout);
      await refreshInventory();
    } catch (err) {
      console.error(err);
      throw new Error('Could not delete item');
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    errorMessage,
    fetchInventoryItems,
    handleEditSave,
    handleDelete,
  };
};