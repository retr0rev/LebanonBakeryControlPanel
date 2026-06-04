const API = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api'

async function request(path: string, options?: RequestInit) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export const api = {
  dashboard: {
    summary: () => request('/dashboard/summary'),
    recentSales: () => request('/dashboard/recent-sales'),
  },
  products: {
    list: () => request('/products'),
    sync: () => request('/products/sync', { method: 'POST' }),
    update: (id: number, data: any) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => request(`/products/${id}`, { method: 'DELETE' }),
  },
  inventory: {
    list: () => request('/inventory'),
    update: (productId: number, quantity: number) =>
      request(`/inventory/${productId}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
    add: (productId: number, quantity: number) =>
      request(`/inventory/${productId}/add`, { method: 'POST', body: JSON.stringify({ quantity }) }),
  },
  sales: {
    list: () => request('/sales'),
    create: (product_id: number, quantity: number, notes?: string) =>
      request('/sales', { method: 'POST', body: JSON.stringify({ product_id, quantity, notes }) }),
  },
  workers: {
    list: () => request('/workers'),
    create: (data: any) => request('/workers', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) => request(`/workers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => request(`/workers/${id}`, { method: 'DELETE' }),
  },
}
