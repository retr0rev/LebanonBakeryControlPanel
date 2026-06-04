import { db, seedInventory, type Product, type Worker } from '@/db/localDb'

const API_BASE = 'https://sadek-s-bakery-production.up.railway.app'

export const api = {
  dashboard: {
    async summary() {
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
      const sales = await db.sales.orderBy('sold_at').reverse().limit(10).toArray()
      const products = await db.products.toArray()
      const productMap = new Map(products.map(p => [p.id, p]))
      return sales.map(s => ({
        ...s,
        product_name: productMap.get(s.product_id)?.name || '',
      }))
    },
  },

  products: {
    async list() {
      return db.products.orderBy('id').toArray()
    },
    async sync() {
      const res = await fetch(`${API_BASE}/api/products`)
      const products: Product[] = await res.json()
      const now = new Date().toISOString()
      await db.products.bulkPut(
        products.map(p => ({
          ...p,
          price: Number(p.price),
          updated_at: now,
        }))
      )
      await seedInventory()
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
      const items = await db.inventory.toArray()
      const products = await db.products.toArray()
      const productMap = new Map(products.map(p => [p.id, p]))
      return items.map(i => ({
        ...i,
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
      const sales = await db.sales.orderBy('sold_at').reverse().toArray()
      const products = await db.products.toArray()
      const productMap = new Map(products.map(p => [p.id, p]))
      return sales.map(s => ({
        ...s,
        product_name: productMap.get(s.product_id)?.name || '',
        category: productMap.get(s.product_id)?.category || '',
      }))
    },
    async create(product_id: number, quantity: number, notes?: string) {
      const product = await db.products.get(product_id)
      if (!product) throw new Error('Product not found')
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
