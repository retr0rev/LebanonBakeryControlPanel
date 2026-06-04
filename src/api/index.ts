import { db, seedInitialData, type Product, type Worker } from '@/db/localDb'

const API_BASE = 'https://sadek-s-bakery-production.up.railway.app'

let initialized = false

async function ensureData() {
  if (!initialized) {
    await seedInitialData()
    initialized = true
  }
}

export const api = {
  async init() {
    await ensureData()
  },

  dashboard: {
    async summary() {
      await ensureData()
      const [totalProducts, sales, lowStock, totalWorkers] = await Promise.all([
        db.products.count(),
        db.sales.toArray(),
        db.inventory.where('quantity').below(10).count(),
        db.workers.count(),
      ])
      const revenue = sales.reduce((sum, s) => sum + Number(s.total_price), 0)
      return { totalProducts, totalSales: sales.length, revenue, lowStock, totalWorkers }
    },
    async recentSales() {
      await ensureData()
      const sales = await db.sales.orderBy('sold_at').reverse().limit(10).toArray()
      const products = await db.products.toArray()
      const productMap = new Map(products.map(p => [p.id, p]))
      return sales.map(s => ({
        ...s,
        id: s.id!,
        product_name: productMap.get(s.product_id)?.name || '',
      }))
    },
  },

  products: {
    async list() {
      await ensureData()
      return db.products.orderBy('id').toArray()
    },
    async sync() {
      const res = await fetch(`${API_BASE}/api/products`)
      if (!res.ok) throw new Error(`خطأ في التحميل: ${res.status}`)
      const data = await res.json()
      if (!Array.isArray(data) || data.length === 0) throw new Error('لا توجد منتجات متاحة')
      const now = new Date().toISOString()
      const products: Product[] = data.map((p: any) => ({
        id: Number(p.id),
        name: String(p.name || ''),
        description: String(p.description || ''),
        price: Number(p.price) || 0,
        ingredients: String(p.ingredients || ''),
        image: p.image || null,
        category: String(p.category || ''),
        created_at: p.created_at || now,
        updated_at: now,
      }))
      for (const p of products) {
        const exists = await db.products.get(p.id)
        if (exists) {
          await db.products.update(p.id, p)
        } else {
          await db.products.add(p)
        }
        const inv = await db.inventory.where('product_id').equals(p.id).first()
        if (!inv) {
          await db.inventory.add({ product_id: p.id, quantity: 50, updated_at: now })
        }
      }
      return { message: `تمت مزامنة ${products.length} منتج` }
    },
    async update(id: number, data: Partial<Product>) {
      await db.products.update(id, { ...data, updated_at: new Date().toISOString() })
      return db.products.get(id)
    },
    async delete(id: number) {
      await db.products.delete(id)
      await db.inventory.where('product_id').equals(id).delete()
      await db.sales.where('product_id').equals(id).delete()
    },
  },

  inventory: {
    async list() {
      await ensureData()
      const items = await db.inventory.toArray()
      const products = await db.products.toArray()
      const productMap = new Map(products.map(p => [p.id, p]))
      return items.map(i => ({
        ...i,
        id: i.id!,
        product_id: i.product_id,
        product_name: productMap.get(i.product_id)?.name || '',
        category: productMap.get(i.product_id)?.category || '',
        price: productMap.get(i.product_id)?.price || 0,
      }))
    },
    async update(productId: number, quantity: number) {
      const item = await db.inventory.where('product_id').equals(productId).first()
      if (item?.id) {
        await db.inventory.update(item.id, { quantity, updated_at: new Date().toISOString() })
      }
    },
    async add(productId: number, quantity: number) {
      const item = await db.inventory.where('product_id').equals(productId).first()
      if (item?.id) {
        await db.inventory.update(item.id, {
          quantity: (item.quantity || 0) + quantity,
          updated_at: new Date().toISOString(),
        })
      }
    },
  },

  sales: {
    async list() {
      await ensureData()
      const sales = await db.sales.orderBy('sold_at').reverse().toArray()
      const products = await db.products.toArray()
      const productMap = new Map(products.map(p => [p.id, p]))
      return sales.map(s => ({
        ...s,
        id: s.id!,
        product_name: productMap.get(s.product_id)?.name || '',
        category: productMap.get(s.product_id)?.category || '',
      }))
    },
    async create(product_id: number, quantity: number, notes?: string) {
      const product = await db.products.get(product_id)
      if (!product) throw new Error('المنتج غير موجود')
      const total_price = Number(product.price) * quantity
      const now = new Date().toISOString()
      const id = await db.sales.add({
        product_id,
        quantity,
        total_price,
        notes: notes || '',
        sold_at: now,
      })
      const item = await db.inventory.where('product_id').equals(product_id).first()
      if (item?.id) {
        await db.inventory.update(item.id, {
          quantity: Math.max(0, (item.quantity || 0) - quantity),
          updated_at: now,
        })
      }
      return { id, product_id, quantity, total_price, notes, sold_at: now }
    },
  },

  workers: {
    async list() {
      await ensureData()
      return db.workers.orderBy('id').toArray()
    },
    async create(data: Omit<Worker, 'id' | 'created_at'>) {
      const id = await db.workers.add({
        ...data,
        created_at: new Date().toISOString(),
      })
      return db.workers.get(id)
    },
    async update(id: number, data: Partial<Worker>) {
      await db.workers.update(id, data)
      return db.workers.get(id)
    },
    async delete(id: number) {
      await db.workers.delete(id)
    },
  },
}
