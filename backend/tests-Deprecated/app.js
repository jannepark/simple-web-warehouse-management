// tests/app.js
import express from 'express';
import usersRouter from '../routes/users.js';
import locationsRouter from '../routes/locations.js';
import userWarehousesRouter from '../routes/userWarehouses.js';
import inventoriesRouter from '../routes/inventories.js';
import loginRouter from '../routes/login.js';
import logoutRouter from '../routes/logout.js';
import errorHandler from '../middlewares/errorHandler.js';

const app = express();
app.use(express.json());
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/users', usersRouter);
app.use('/locations', locationsRouter);
app.use('/inventories', inventoriesRouter);
app.use('/user_warehouses', userWarehousesRouter);
app.use(errorHandler);

export default app;