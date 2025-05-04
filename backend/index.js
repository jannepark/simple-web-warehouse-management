import express from 'express'
import path from 'path'
import { PORT } from './util/config.js'
import { connectToDatabase } from './util/db.js'
import cors from 'cors'
import usersRouter from './routes/users.js'
import locationsRouter from './routes/locations.js'
import warehousesRouter from './routes/warehouses.js'
import inventoriesRouter from './routes/inventories.js'
import errorHandler from './middlewares/errorHandler.js'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.status(200).send('OK')
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public'))
}

app.use('/api/users', usersRouter);
app.use('/api/warehouses', warehousesRouter);
app.use('/api/locations', locationsRouter);
app.use('/api/inventories', inventoriesRouter);

if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.resolve('public', 'index.html'))
  })
}
app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()



