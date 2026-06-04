import { Router, Request, Response } from 'express'
import pool from '../db'

const router = Router()

const API_BASE = 'https://sadek-s-bakery-production.up.railway.app'

router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

router.post('/sync', async (_req: Request, res: Response) => {
  try {
    const response = await fetch(`${API_BASE}/api/products`)
    const products = await response.json()

    for (const product of products) {
      await pool.query(
        `INSERT INTO products (id, name, description, price, ingredients, image, category, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           description = EXCLUDED.description,
           price = EXCLUDED.price,
           ingredients = EXCLUDED.ingredients,
           image = EXCLUDED.image,
           category = EXCLUDED.category,
           updated_at = NOW()`,
        [
          product.id, product.name, product.description, product.price,
          product.ingredients, product.image, product.category,
          product.created_at, product.updated_at
        ]
      )

      await pool.query(
        `INSERT INTO inventory (product_id, quantity)
         VALUES ($1, 0)
         ON CONFLICT DO NOTHING`,
        [product.id]
      )
    }

    res.json({ message: `Synced ${products.length} products` })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  const { name, description, price, category } = req.body
  try {
    const result = await pool.query(
      `UPDATE products SET name=$1, description=$2, price=$3, category=$4, updated_at=NOW()
       WHERE id=$5 RETURNING *`,
      [name, description, price, category, id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [id])
    res.json({ message: 'Product deleted' })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

export default router
