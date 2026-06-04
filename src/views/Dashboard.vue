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
  id?: number
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
            <span class="card-label">إجمالي المنتجات</span>
            <span class="card-value">{{ summary?.totalProducts }}</span>
          </div>
        </div>
        <div class="card card-revenue">
          <div class="card-icon-box">💰</div>
          <div class="card-content">
            <span class="card-label">إجمالي الإيرادات</span>
            <span class="card-value">{{ Number(summary?.revenue || 0).toLocaleString('ar-LB') }} <small>ل.س</small></span>
          </div>
        </div>
        <div class="card card-sales">
          <div class="card-icon-box">🧾</div>
          <div class="card-content">
            <span class="card-label">إجمالي المبيعات</span>
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
            <span class="card-label">عدد العمال</span>
            <span class="card-value">{{ summary?.totalWorkers }}</span>
          </div>
        </div>
      </div>

      <div class="section" style="margin-bottom: 12px;">
        <h3>🕐 آخر المبيعات</h3>
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
                <td>{{ sale.product_name }}</td>
                <td>{{ sale.quantity }}</td>
                <td style="color: var(--primary); font-weight: 700;">{{ Number(sale.total_price).toLocaleString('ar-LB') }} ل.س</td>
                <td style="font-size: 0.72rem; color: var(--text-light);">{{ new Date(sale.sold_at).toLocaleString('ar-LB') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else style="text-align: center; padding: 1rem; color: var(--text-light);">لا توجد مبيعات بعد</p>
      </div>

      <div class="section">
        <h3>⚡ إجراءات سريعة</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <router-link to="/inventory" class="action-btn">
            <span style="font-size: 1.3rem;">📦</span>
            <span>إضافة مخزون</span>
          </router-link>
          <router-link to="/sales" class="action-btn">
            <span style="font-size: 1.3rem;">💰</span>
            <span>تسجيل بيع</span>
          </router-link>
          <router-link to="/products" class="action-btn">
            <span style="font-size: 1.3rem;">🔄</span>
            <span>مزامنة</span>
          </router-link>
          <router-link to="/workers" class="action-btn">
            <span style="font-size: 1.3rem;">👷</span>
            <span>العمال</span>
          </router-link>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px;
  background: var(--bg);
  border-radius: 10px;
  text-decoration: none;
  color: var(--text);
  font-size: 0.78rem;
  font-weight: 600;
  transition: all 0.2s;
}

.action-btn:active {
  background: var(--primary);
  color: #fff;
}
</style>
