import { Location, Warehouse, Item } from '../models/index.js';
import { BadRequestError, NotFoundError } from '../middlewares/requestErrors.js';

export const getLocations = async (req, res, next) => {
  try {
    const locations = await Location.findAll({
      include: [
        {
          model: Warehouse,
          as: 'warehouse',
        },
        {
          model: Item,
          as: 'items',
          through: { attributes: ['quantity'] },
        },
      ],
    });

    if (!locations || locations.length === 0) {
      throw new NotFoundError('No locations found');
    }

    res.status(200).json(locations);
  } catch (error) {
    next(error);
  }
};

export const createLocation = async (req, res, next) => {
  try {
    const { name, warehouseId } = req.body;

    if (!name || !warehouseId) {
      throw new BadRequestError('Location name and warehouse ID are required');
    }

    const warehouse = await Warehouse.findByPk(warehouseId);

    if (!warehouse) {
      throw new NotFoundError('Warehouse not found');
    }

    const location = await Location.create(req.body);
    res.status(201).json(location);
  } catch (error) {
    next(error);
  }
};

export const updateLocation = async (req, res, next) => {
  try {
    const location = await Location.findByPk(req.params.id);

    if (!location) {
      throw new NotFoundError('Location not found');
    }

    await location.update(req.body);
    res.json(location);
  } catch (error) {
    next(error);
  }
};

export const deleteLocation = async (req, res, next) => {
  try {
    const location = await Location.findByPk(req.params.id);

    if (!location) {
      throw new NotFoundError('Location not found');
    }

    await location.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};