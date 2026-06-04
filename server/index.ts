import express from 'express'
import cors from 'cors'
import productsRouter from './routes/products'
import inventoryRouter from './routes/inventory'
import salesRouter from './routes/sales'
import workersRouter from './routes/workers'
import dashboardRouter from './routes/dashboard'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/products', productsRouter)
app.use('/api/inventory', inventoryRouter)
app.use('/api/sales', salesRouter)
app.use('/api/workers', workersRouter)
app.use('/api/dashboard', dashboardRouter)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
