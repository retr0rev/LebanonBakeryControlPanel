import Dexie, { type Table } from 'dexie'

export interface Product {
  id: number
  name: string
  description: string
  price: number
  ingredients: string
  image: string | null
  category: string
  created_at: string
  updated_at: string
}

export interface Inventory {
  id?: number
  product_id: number
  quantity: number
  updated_at: string
}

export interface Sale {
  id?: number
  product_id: number
  quantity: number
  total_price: number
  sold_at: string
  notes: string
}

export interface Worker {
  id?: number
  name: string
  job: string
  weekly_salary: number
  phone: string
  created_at: string
}

class BakeryDB extends Dexie {
  products!: Table<Product, number>
  inventory!: Table<Inventory, number>
  sales!: Table<Sale, number>
  workers!: Table<Worker, number>

  constructor() {
    super('LebanonBakery')
    this.version(1).stores({
      products: 'id, name, category',
      inventory: '++id, product_id',
      sales: '++id, product_id, sold_at',
      workers: '++id, name, job',
    })
  }
}

export const db = new BakeryDB()

export async function seedInventory() {
  const count = await db.inventory.count()
  if (count > 0) return
  const products = await db.products.toArray()
  const now = new Date().toISOString()
  for (const p of products) {
    const exists = await db.inventory.where('product_id').equals(p.id).first()
    if (!exists) {
      await db.inventory.add({ product_id: p.id, quantity: 0, updated_at: now })
    }
  }
}
