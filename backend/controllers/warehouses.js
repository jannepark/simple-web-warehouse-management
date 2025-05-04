import { Warehouse, Location } from '../models/index.js';
import { sequelize } from '../util/db.js';
import { BadRequestError, NotFoundError } from '../middlewares/requestErrors.js';

export const getWarehouses = async (req, res, next) => {
  try {
    const warehouses = await Warehouse.findAll({
      include: {
        model: Location,
        as: 'locations',
      },
    });

    if (!warehouses || warehouses.length === 0) {
      throw new NotFoundError('No warehouses found');
    }
    res.status(200).json(warehouses);
  } catch (error) {
    next(error);
  }
};

export const getWarehouseById = async (req, res, next) => {
  try {
    if (!req.params.id) {
      throw new BadRequestError('Warehouse ID is required');
    }

    const warehouse = await Warehouse.findOne({
      where: { id: req.params.id },
      include: {
        model: Location,
        as: 'locations',
      },
    });

    if (!warehouse) {
      throw new NotFoundError('Warehouse not found');
    }

    res.status(200).json(warehouse);
  } catch (error) {
    next(error);
  }
};

export const createWarehouse = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, description } = req.body;
    if (!name) {
      throw new BadRequestError('Warehouse name is required');
    }

    const warehouse = await Warehouse.create({ name, description }, { transaction });

    await transaction.commit();
    res.status(201).json(warehouse);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

export const updateWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findByPk(req.params.id);

    if (!warehouse) {
      throw new NotFoundError('Warehouse not found');
    }

    await warehouse.update(req.body);
    res.status(200).json(warehouse);
  } catch (error) {
    next(error);
  }
};

export const deleteWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findByPk(req.params.id);

    if (!warehouse) {
      throw new NotFoundError('Warehouse not found');
    }

    await warehouse.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};