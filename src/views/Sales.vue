<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/api'

interface Sale {
  id?: number
  product_id: number
  product_name: string
  quantity: number
  total_price: number
  notes: string
  sold_at: string
}

interface Product {
  id: number
  name: string
  price: number
}

const sales = ref<Sale[]>([])
const products = ref<Product[]>([])
const loading = ref(false)
const message = ref('')
const newSale = ref({ product_id: 0, quantity: 1, notes: '' })

onMounted(() => {
  loadSales()
  loadProducts()
})

async function loadSales() {
  loading.value = true
  try {
    sales.value = await api.sales.list()
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function loadProducts() {
  try {
    products.value = await api.products.list()
  } catch (e) {
    console.error(e)
  }
}

async function recordSale() {
  if (!newSale.value.product_id || newSale.value.quantity <= 0) return
  try {
    await api.sales.create(newSale.value.product_id, newSale.value.quantity, newSale.value.notes)
    message.value = '✅ تم تسجيل البيع بنجاح'
    newSale.value = { product_id: 0, quantity: 1, notes: '' }
    setTimeout(() => message.value = '', 2500)
    await loadSales()
  } catch (e) {
    console.error(e)
    message.value = '❌ فشل تسجيل البيع'
  }
}
</script>

<template>
  <div class="page">
    <h2>💰 المبيعات</h2>
    <p v-if="message" class="message">{{ message }}</p>

    <div class="sale-form-card">
      <h3>🛒 تسجيل بيع جديد</h3>
      <form @submit.prevent="recordSale" class="sale-form">
        <div class="form-row">
          <div class="form-group">
            <label>المنتج</label>
            <select v-model.number="newSale.product_id" required>
              <option :value="0" disabled>اختر المنتج ...</option>
              <option v-for="p in products" :key="p.id" :value="p.id">
                {{ p.name }} — {{ p.price.toLocaleString('ar-LB') }} ل.س
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>الكمية</label>
            <input type="number" v-model.number="newSale.quantity" min="1" placeholder="الكمية" required />
          </div>
          <div class="form-group">
            <label>ملاحظات</label>
            <input type="text" v-model="newSale.notes" placeholder="اختياري" />
          </div>
        </div>
        <button type="submit" class="btn submit-btn">🧾 تسجيل البيع</button>
      </form>
    </div>

    <div class="sales-stats" v-if="sales.length">
      <div class="stat-chip">
        <span class="stat-label">إجمالي المبيعات</span>
        <span class="stat-value">{{ sales.length }}</span>
      </div>
      <div class="stat-chip">
        <span class="stat-label">الإيرادات</span>
        <span class="stat-value primary">{{ sales.reduce((s, x) => s + Number(x.total_price), 0).toLocaleString('ar-LB') }} ل.س</span>
      </div>
    </div>

    <div v-if="loading" class="loading">جاري التحميل...</div>

    <table v-else-if="sales.length">
      <thead>
        <tr>
          <th>#</th>
          <th>المنتج</th>
          <th>الكمية</th>
          <th>السعر الإجمالي</th>
          <th>ملاحظات</th>
          <th>التاريخ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sale in sales" :key="sale.id">
          <td>{{ sale.id }}</td>
          <td class="product-cell">{{ sale.product_name }}</td>
          <td>{{ sale.quantity }}</td>
          <td class="price-cell">{{ Number(sale.total_price).toLocaleString('ar-LB') }} ل.س</td>
          <td>{{ sale.notes || '—' }}</td>
          <td class="date-cell">{{ new Date(sale.sold_at).toLocaleString('ar-LB') }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else class="empty-state">لا توجد مبيعات بعد 🍪</p>
  </div>
</template>

<style scoped>
.sale-form-card {
  background: var(--bg-card);
  border-radius: var(--radius);
  padding: 1.5rem;
  box-shadow: var(--shadow);
  margin-bottom: 1.5rem;
}

.sale-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.form-group {
  flex: 1;
  min-width: 180px;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: var(--text);
}

.form-group select,
.form-group input {
  width: 100%;
}

.submit-btn {
  align-self: flex-start;
  font-size: 1rem;
  padding: 0.7rem 1.5rem;
}

.sales-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.stat-chip {
  background: var(--bg-card);
  border-radius: 10px;
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-light);
  font-weight: 600;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text);
}

.stat-value.primary {
  color: var(--primary);
}

.product-cell {
  font-weight: 600;
}

.price-cell {
  font-weight: 700;
  color: var(--primary);
}

.date-cell {
  font-size: 0.85rem;
  color: var(--text-light);
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-light);
  font-size: 1.1rem;
}
</style>
