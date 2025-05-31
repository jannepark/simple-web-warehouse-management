
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../util/db.js';


class Item extends Model { }

Item.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  category: {
    type: DataTypes.STRING
  },
  unit: {
    type: DataTypes.STRING
  },
  barcode: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'item'
});

// Add a partial unique index for the barcode field
sequelize.sync().then(() => {
  sequelize.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS unique_barcode_index
    ON items (barcode)
    WHERE barcode IS NOT NULL;
  `);
});

export default Item;

