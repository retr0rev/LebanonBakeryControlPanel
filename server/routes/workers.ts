import { Router, Request, Response } from 'express'
import pool from '../db'

const router = Router()

router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM workers ORDER BY id')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

router.post('/', async (req: Request, res: Response) => {
  const { name, job, weekly_salary, phone } = req.body
  try {
    const result = await pool.query(
      `INSERT INTO workers (name, job, weekly_salary, phone)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, job, weekly_salary, phone || '']
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  const { name, job, weekly_salary, phone } = req.body
  try {
    const result = await pool.query(
      `UPDATE workers SET name=$1, job=$2, weekly_salary=$3, phone=$4
       WHERE id=$5 RETURNING *`,
      [name, job, weekly_salary, phone, id]
    )
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM workers WHERE id = $1', [id])
    res.json({ message: 'Worker deleted' })
  } catch (err) {
    res.status(500).json({ error: (err as Error).message })
  }
})

export default router
