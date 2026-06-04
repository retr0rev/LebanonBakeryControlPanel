import { Router, Request, Response } from 'express'
import pool from '../db'

const router = Router()

router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT s.*, p.name as product_name, p.category
       FROM sales s
       JOIN products p ON p.id = s.product_id
       ORDER BY s.sold_at DESC`
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

router.post('/', async (req: Request, res: Response) => {
  const { product_id, quantity, notes } = req.body
  try {
    const product = await pool.query('SELECT price FROM products WHERE id = $1', [product_id])
    if (product.rows.length === 0) {
      res.status(404).json({ error: 'Product not found' })
      return
    }
    const price = product.rows[0].price
    const total_price = price * quantity

    const result = await pool.query(
      `INSERT INTO sales (product_id, quantity, total_price, notes)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [product_id, quantity, total_price, notes || '']
    )

    await pool.query(
      `UPDATE inventory SET quantity = quantity - $1, updated_at=NOW()
       WHERE product_id = $2`,
      [quantity, product_id]
    )

    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

export default router
