import { Router, Request, Response } from 'express'
import pool from '../db'

const router = Router()

router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT i.*, p.name as product_name, p.category, p.price
       FROM inventory i
       JOIN products p ON p.id = i.product_id
       ORDER BY p.name`
    )
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

router.put('/:productId', async (req: Request, res: Response) => {
  const { productId } = req.params
  const { quantity } = req.body
  try {
    const result = await pool.query(
      `UPDATE inventory SET quantity=$1, updated_at=NOW()
       WHERE product_id=$2 RETURNING *`,
      [quantity, productId]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

router.post('/:productId/add', async (req: Request, res: Response) => {
  const { productId } = req.params
  const { quantity } = req.body
  try {
    const result = await pool.query(
      `UPDATE inventory SET quantity = quantity + $1, updated_at=NOW()
       WHERE product_id=$2 RETURNING *`,
      [quantity, productId]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

export default router
