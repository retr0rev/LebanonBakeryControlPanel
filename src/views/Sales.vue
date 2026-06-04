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
    message.value = '✅ تم تسجيل البيع'
    newSale.value = { product_id: 0, quantity: 1, notes: '' }
    setTimeout(() => message.value = '', 2000)
    await loadSales()
  } catch (e) {
    console.error(e)
    message.value = '❌ فشل تسجيل البيع'
  }
}
</script>

<template>
  <div>
    <h2>💰 المبيعات</h2>
    <p v-if="message" class="message">{{ message }}</p>

    <div class="section" style="margin-bottom: 12px;">
      <h3>🛒 تسجيل بيع جديد</h3>
      <form @submit.prevent="recordSale">
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div>
            <label style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 4px;">المنتج</label>
            <select v-model.number="newSale.product_id" required style="width: 100%;">
              <option :value="0" disabled>اختر المنتج ...</option>
              <option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }} — {{ p.price.toLocaleString('ar-LB') }} ل.س</option>
            </select>
          </div>
          <div style="display: flex; gap: 8px;">
            <div style="flex: 1;">
              <label style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 4px;">الكمية</label>
              <input type="number" v-model.number="newSale.quantity" min="1" required style="width: 100%;" />
            </div>
            <div style="flex: 1;">
              <label style="font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 4px;">ملاحظات</label>
              <input type="text" v-model="newSale.notes" placeholder="اختياري" style="width: 100%;" />
            </div>
          </div>
          <button type="submit" class="btn" style="align-self: stretch;">🧾 تسجيل البيع</button>
        </div>
      </form>
    </div>

    <div v-if="sales.length" style="display: flex; gap: 8px; margin-bottom: 10px;">
      <div style="background: var(--bg-card); border-radius: 8px; padding: 8px 12px; box-shadow: var(--shadow); flex: 1;">
        <div style="font-size: 0.7rem; color: var(--text-light); font-weight: 600;">إجمالي</div>
        <div style="font-size: 1rem; font-weight: 800;">{{ sales.length }}</div>
      </div>
      <div style="background: var(--bg-card); border-radius: 8px; padding: 8px 12px; box-shadow: var(--shadow); flex: 1;">
        <div style="font-size: 0.7rem; color: var(--text-light); font-weight: 600;">الإيرادات</div>
        <div style="font-size: 1rem; font-weight: 800; color: var(--primary);">{{ sales.reduce((s, x) => s + Number(x.total_price), 0).toLocaleString('ar-LB') }} ل.س</div>
      </div>
    </div>

    <div v-if="loading" class="loading">جاري التحميل...</div>

    <div class="table-wrap" v-else-if="sales.length">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>المنتج</th>
            <th>الكمية</th>
            <th>السعر</th>
            <th>التاريخ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sale in sales" :key="sale.id">
            <td>{{ sale.id }}</td>
            <td style="font-weight: 600;">{{ sale.product_name }}</td>
            <td>{{ sale.quantity }}</td>
            <td style="color: var(--primary); font-weight: 700;">{{ Number(sale.total_price).toLocaleString('ar-LB') }} ل.س</td>
            <td style="font-size: 0.7rem; color: var(--text-light);">{{ new Date(sale.sold_at).toLocaleString('ar-LB') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else style="text-align: center; padding: 2rem; color: var(--text-light);">لا توجد مبيعات بعد 🍪</p>
  </div>
</template>
