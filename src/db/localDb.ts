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

const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: 'بيتي فور', description: '', price: 450, ingredients: '', image: null, category: 'حلويات', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 2, name: 'برازق', description: '', price: 450, ingredients: '', image: null, category: 'حلويات', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 3, name: 'غريبة', description: '', price: 450, ingredients: '', image: null, category: 'حلويات', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 4, name: 'كعك تمر', description: '', price: 450, ingredients: '', image: null, category: 'حلويات', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 5, name: 'كعك مالح بجبنة', description: '', price: 450, ingredients: '', image: null, category: 'حلويات', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 6, name: 'كعك مفخر بحليب', description: '', price: 350, ingredients: '', image: null, category: 'كعك', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 7, name: 'كعك مفخر', description: '', price: 300, ingredients: '', image: null, category: 'كعك', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 8, name: 'كعك بشمرة ويانسون', description: '', price: 300, ingredients: '', image: null, category: 'كعك', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
]

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

export async function seedInitialData() {
  const productCount = await db.products.count()
  const now = new Date().toISOString()

  if (productCount === 0) {
    await db.products.bulkAdd(INITIAL_PRODUCTS)
    for (const p of INITIAL_PRODUCTS) {
      await db.inventory.add({ product_id: p.id, quantity: 50, updated_at: now })
    }
  } else {
    const invCount = await db.inventory.count()
    if (invCount === 0) {
      const products = await db.products.toArray()
      for (const p of products) {
        await db.inventory.add({ product_id: p.id, quantity: 50, updated_at: now })
      }
    }
  }
}
