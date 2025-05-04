import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../util/db.js';

class Inventory extends Model { }

Inventory.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  itemId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'items',
      key: 'id'
    },
    field: 'item_id'
  },
  locationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'locations',
      key: 'id'
    },
    field: 'location_id'
  },
  quantity: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  lastUpdated: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'last_updated'
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'inventory',
  indexes: [
    {
      unique: true,
      fields: ['item_id', 'location_id']
    }
  ]
});

export default Inventory;
