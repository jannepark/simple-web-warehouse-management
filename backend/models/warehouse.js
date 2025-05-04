
import { Model, DataTypes } from 'sequelize'
import { sequelize } from '../util/db.js'
class Warehouse extends Model { }

Warehouse.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.TEXT,
  },
  description: {
    type: DataTypes.TEXT,
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'warehouse'
})

export default Warehouse