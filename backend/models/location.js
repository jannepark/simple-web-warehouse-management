
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../util/db.js';

class Location extends Model { }

Location.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  warehouseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'warehouses',
      key: 'id'
    },
    field: 'warehouse_id'
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'location'
});

export default Location
