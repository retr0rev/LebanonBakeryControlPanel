import { Router, Request, Response } from 'express'
import pool from '../db'

const router = Router()

router.get('/summary', async (_req: Request, res: Response) => {
  try {
    const totalProducts = await pool.query('SELECT COUNT(*) FROM products')
    const totalSales = await pool.query('SELECT COUNT(*), COALESCE(SUM(total_price), 0) as revenue FROM sales')
    const lowStock = await pool.query(
      `SELECT COUNT(*) FROM inventory WHERE quantity < 10`
    )
    const totalWorkers = await pool.query('SELECT COUNT(*) FROM workers')

    res.json({
      totalProducts: parseInt(totalProducts.rows[0].count),
      totalSales: parseInt(totalSales.rows[0].count),
      revenue: parseFloat(totalSales.rows[0].revenue),
      lowStock: parseInt(lowStock.rows[0].count),
      totalWorkers: parseInt(totalWorkers.rows[0].count),
    })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

router.get('/recent-sales', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT s.*, p.name as product_name
       FROM sales s
       JOIN products p ON p.id = s.product_id
       ORDER BY s.sold_at DESC LIMIT 10`
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

export default router
