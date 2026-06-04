<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/api'

interface Sale {
  id: number
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
const form = ref({ product_id: 0, quantity: 1, notes: '' })

onMounted(() => { loadSales(); loadProducts() })

async function loadSales() {
  loading.value = true
  try { sales.value = await api.sales.list() } catch (e) { console.error(e) } finally { loading.value = false }
}

async function loadProducts() {
  try { products.value = await api.products.list() } catch (e) { console.error(e) }
}

async function recordSale() {
  if (!form.value.product_id || form.value.quantity <= 0) return
  try {
    await api.sales.create(form.value.product_id, form.value.quantity, form.value.notes)
    message.value = '✅ تم تسجيل البيع'
    form.value = { product_id: 0, quantity: 1, notes: '' }
    setTimeout(() => message.value = '', 2000)
    await loadSales()
  } catch (e) {
    message.value = '❌ فشل تسجيل البيع'
  }
}

const totalRevenue = () => sales.value.reduce((s, x) => s + Number(x.total_price), 0)
</script>

<template>
  <div>
    <h2>💰 المبيعات</h2>
    <p v-if="message" class="message">{{ message }}</p>

    <div class="section" style="margin-bottom: 12px;">
      <h3 style="margin-bottom: 12px;">🛒 بيع جديد</h3>
      <form @submit.prevent="recordSale">
        <div style="margin-bottom: 10px;">
          <label style="font-size: 0.78rem; font-weight: 600; display: block; margin-bottom: 4px;">المنتج</label>
          <select v-model.number="form.product_id" required style="width: 100%;">
            <option :value="0" disabled>اختر المنتج...</option>
            <option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }} — {{ p.price.toLocaleString('ar-LB') }} ل.س</option>
          </select>
        </div>
        <div style="display: flex; gap: 8px; margin-bottom: 12px;">
          <div style="flex: 1;">
            <label style="font-size: 0.78rem; font-weight: 600; display: block; margin-bottom: 4px;">الكمية</label>
            <input type="number" v-model.number="form.quantity" min="1" required style="width: 100%;" />
          </div>
          <div style="flex: 1;">
            <label style="font-size: 0.78rem; font-weight: 600; display: block; margin-bottom: 4px;">ملاحظات</label>
            <input type="text" v-model="form.notes" placeholder="اختياري" style="width: 100%;" />
          </div>
        </div>
        <button type="submit" class="btn" style="width: 100%;">🧾 تسجيل البيع</button>
      </form>
    </div>

    <div v-if="sales.length" style="display: flex; gap: 8px; margin-bottom: 12px;">
      <div class="section" style="flex: 1; padding: 12px;">
        <div style="font-size: 0.65rem; color: var(--text-muted); font-weight: 600;">إجمالي المبيعات</div>
        <div style="font-size: 1.1rem; font-weight: 800;">{{ sales.length }}</div>
      </div>
      <div class="section" style="flex: 1; padding: 12px;">
        <div style="font-size: 0.65rem; color: var(--text-muted); font-weight: 600;">الإيرادات</div>
        <div style="font-size: 1.1rem; font-weight: 800; color: var(--primary);">{{ totalRevenue().toLocaleString('ar-LB') }} ل.س</div>
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
            <td style="color: var(--text-muted);">{{ sale.id }}</td>
            <td style="font-weight: 600;">{{ sale.product_name }}</td>
            <td>{{ sale.quantity }}</td>
            <td style="color: var(--primary); font-weight: 700;">{{ Number(sale.total_price).toLocaleString('ar-LB') }} ل.س</td>
            <td style="font-size: 0.68rem; color: var(--text-muted);">{{ new Date(sale.sold_at).toLocaleString('ar-LB') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else style="text-align: center; padding: 40px 16px; color: var(--text-muted);">لا توجد مبيعات بعد 🍪</p>
  </div>
</template>
