import { Inventory, Item, Location, Warehouse } from '../models/index.js';
import { sequelize } from '../util/db.js';
import { BadRequestError, NotFoundError } from '../middlewares/requestErrors.js';

export const getItemsAndInventories = async (req, res, next) => {
  try {
    // Fetch all items with their associated inventories (if any)
    const itemsWithInventories = await Item.findAll({
      include: [
        {
          model: Inventory,
          as: 'inventories',
          required: false,
          include: [
            {
              model: Location,
              as: 'location',
              include: [
                {
                  model: Warehouse,
                  as: 'warehouse', 
                  attributes: ['name'],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!itemsWithInventories || itemsWithInventories.length === 0) {
      throw new NotFoundError('No items or inventories found');
    }

    res.status(200).json(itemsWithInventories);
  } catch (error) {
    next(error);
  }
};

export const getInventoryByLocation = async (req, res, next) => {
  try {
    const inventories = await Inventory.findAll({
      include: [
        {
          model: Item,
          as: 'item',
        },
        {
          model: Location,
          as: 'location',
          where: { id: req.params.id },
        },
      ],
    });

    if (!inventories || inventories.length === 0) {
      throw new NotFoundError('No inventories found for the specified location');
    }

    res.status(200).json(inventories);
  } catch (error) {
    next(error);
  }
};

export const createInventory = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    let { itemId, name, description, category, unit, locationId, quantity, barcode } = req.body;

    if (!locationId) {
      throw new BadRequestError('Location is required');
    }

    let item;
    if (itemId) {
      item = await Item.findByPk(itemId);
      if (!item) {
        throw new NotFoundError('Item not found');
      }
    } else {
      if (!name) {
        throw new BadRequestError('Item name is required');
      }
      if (barcode === "") {
        barcode = null; // Ensure barcode is null if empty
      }
      item = await Item.create({ name, description, category, unit, barcode }, { transaction });
    }

    const inventory = await Inventory.create(
      {
        itemId: item.id,
        locationId,
        quantity,
      },
      { transaction }
    );

    await transaction.commit();
    res.status(201).json({ item, inventory });
  } catch (error) {
    await transaction.rollback();
    if (error.name === 'SequelizeUniqueConstraintError') {
      next(new BadRequestError('Inventory with this item and location already exists'));
    } else {
      next(error);
    }
  }
};

export const updateItem = async (req, res, next) => {
  try {
    const item = await Item.findByPk(req.params.id);
    if (item) {
      const itemName = req.body.name ? req.body.name.trim() : '';
      if (!itemName) {
        throw new BadRequestError('Item name is required');
      }
      await item.update({ ...req.body, name: itemName });
      res.status(200).json(item);
    } else {
      throw new NotFoundError('Item not found');
    }
  } catch (error) {
    next(error);
  }
};

export const deleteInventory = async (req, res, next) => {
  try {
    const inventory = await Inventory.findByPk(req.params.id);
    if (inventory) {
      await inventory.destroy();
      res.status(204).end();
    } else {
      throw new NotFoundError('Inventory not found');
    }
  } catch (error) {
    next(error);
  }
};

export const updateInventory = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { inventoryId, locationId, quantity } = req.body;
    const inventory = await Inventory.findByPk(inventoryId);

    if (inventory) {
      await inventory.update({ locationId, quantity }, { transaction });
    } else {
      throw new NotFoundError('Inventory not found');
    }

    await transaction.commit();
    res.status(200).json(inventory);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

export const createItem = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    let { name, description, category, unit, barcode } = req.body;

    if (!name) {
      throw new BadRequestError('Item name is required');
    }
    if (barcode === "") {
      barcode = null; // Ensure barcode is null if empty
    }
    const item = await Item.create({ name, description, category, unit, barcode }, { transaction });

    await transaction.commit();
    res.status(201).json(item);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

// delete item by id and all its inventories
export const deleteItem = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const item = await Item.findByPk(req.params.id);
    if (item) {
      await Inventory.destroy({ where: { itemId: item.id }, transaction });
      await item.destroy({ transaction });
      await transaction.commit();
      res.status(204).end();
    } else {
      throw new NotFoundError('Item not found');
    }
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};