import User from './user.js';
import Warehouse from './warehouse.js';
import Location from './location.js';
import Item from './item.js';
import Inventory from './inventory.js';
import Session from './session.js';



// Warehouses and Locations
Warehouse.hasMany(Location, { as: 'locations', foreignKey: 'warehouseId' });
Location.belongsTo(Warehouse, { as: 'warehouse', foreignKey: 'warehouseId' });

// Items and Locations (inventory)
Item.belongsToMany(Location, { through: Inventory, as: 'locations', foreignKey: 'itemId' });
Location.belongsToMany(Item, { through: Inventory, as: 'items', foreignKey: 'locationId' });

// Inventories and Items/Locations
Item.hasMany(Inventory, { as: 'inventories', foreignKey: 'itemId' });
Inventory.belongsTo(Item, { as: 'item', foreignKey: 'itemId' });

Location.hasMany(Inventory, { as: 'inventories', foreignKey: 'locationId' });
Inventory.belongsTo(Location, { as: 'location', foreignKey: 'locationId' });

// Sessions
Session.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Session, { foreignKey: 'userId' });

export {
  User,
  Warehouse,
  Location,
  Item,
  Inventory,
  Session
};