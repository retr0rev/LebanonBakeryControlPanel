<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/api'

interface DashboardSummary {
  totalProducts: number
  totalSales: number
  revenue: number
  lowStock: number
  totalWorkers: number
}

interface RecentSale {
  id: number
  product_name: string
  quantity: number
  total_price: number
  sold_at: string
}

const summary = ref<DashboardSummary | null>(null)
const recentSales = ref<RecentSale[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const [s, r] = await Promise.all([
      api.dashboard.summary(),
      api.dashboard.recentSales(),
    ])
    summary.value = s
    recentSales.value = r
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div>
    <h2>📊 لوحة التحكم</h2>

    <div v-if="loading" class="loading">جاري تحميل البيانات...</div>

    <template v-else>
      <div class="cards">
        <div class="card card-products">
          <div class="card-icon-box">📦</div>
          <div class="card-content">
            <span class="card-label">المنتجات</span>
            <span class="card-value">{{ summary?.totalProducts }}</span>
          </div>
        </div>
        <div class="card card-revenue">
          <div class="card-icon-box">💰</div>
          <div class="card-content">
            <span class="card-label">الإيرادات</span>
            <span class="card-value">{{ Number(summary?.revenue || 0).toLocaleString('ar-LB') }} <small>ل.س</small></span>
          </div>
        </div>
        <div class="card card-sales">
          <div class="card-icon-box">🧾</div>
          <div class="card-content">
            <span class="card-label">المبيعات</span>
            <span class="card-value">{{ summary?.totalSales }}</span>
          </div>
        </div>
        <div class="card card-stock" :class="{ 'card-warning': (summary?.lowStock || 0) > 0 }">
          <div class="card-icon-box">⚠️</div>
          <div class="card-content">
            <span class="card-label">مخزون منخفض</span>
            <span class="card-value">{{ summary?.lowStock }}</span>
          </div>
        </div>
        <div class="card card-workers">
          <div class="card-icon-box">👷</div>
          <div class="card-content">
            <span class="card-label">العمال</span>
            <span class="card-value">{{ summary?.totalWorkers }}</span>
          </div>
        </div>
      </div>

      <div class="section" style="margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <h3 style="margin: 0;">🕐 آخر المبيعات</h3>
          <span v-if="recentSales.length" style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">آخر 10</span>
        </div>
        <div class="table-wrap" v-if="recentSales.length">
          <table>
            <thead>
              <tr>
                <th>المنتج</th>
                <th>الكمية</th>
                <th>السعر</th>
                <th>التاريخ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sale in recentSales" :key="sale.id">
                <td style="font-weight: 600;">{{ sale.product_name }}</td>
                <td>{{ sale.quantity }}</td>
                <td style="color: var(--primary); font-weight: 700;">{{ Number(sale.total_price).toLocaleString('ar-LB') }} ل.س</td>
                <td style="font-size: 0.7rem; color: var(--text-muted);">{{ new Date(sale.sold_at).toLocaleString('ar-LB') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else style="text-align: center; padding: 20px; color: var(--text-muted); font-size: 0.85rem;">لا توجد مبيعات بعد</p>
      </div>

      <div class="section">
        <h3 style="margin-bottom: 12px;">⚡ إجراءات سريعة</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <router-link to="/inventory" style="display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 14px; background: #fdfcfa; border-radius: 12px; text-decoration: none; color: var(--text); font-size: 0.78rem; font-weight: 600; border: 1px solid var(--border); transition: all 0.2s;"
            @click.passive>
            <span style="font-size: 1.5rem;">📦</span>
            <span>إضافة مخزون</span>
          </router-link>
          <router-link to="/sales" style="display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 14px; background: #fdfcfa; border-radius: 12px; text-decoration: none; color: var(--text); font-size: 0.78rem; font-weight: 600; border: 1px solid var(--border); transition: all 0.2s;">
            <span style="font-size: 1.5rem;">💰</span>
            <span>تسجيل بيع</span>
          </router-link>
          <router-link to="/products" style="display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 14px; background: #fdfcfa; border-radius: 12px; text-decoration: none; color: var(--text); font-size: 0.78rem; font-weight: 600; border: 1px solid var(--border); transition: all 0.2s;">
            <span style="font-size: 1.5rem;">🔄</span>
            <span>مزامنة</span>
          </router-link>
          <router-link to="/workers" style="display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 14px; background: #fdfcfa; border-radius: 12px; text-decoration: none; color: var(--text); font-size: 0.78rem; font-weight: 600; border: 1px solid var(--border); transition: all 0.2s;">
            <span style="font-size: 1.5rem;">👷</span>
            <span>العمال</span>
          </router-link>
        </div>
      </div>
    </template>
  </div>
</template>
