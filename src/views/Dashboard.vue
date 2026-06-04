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
  <div class="dashboard">
    <div class="dashboard-header">
      <h2>📊 لوحة التحكم</h2>
      <p class="welcome">مرحباً بك في نظام إدارة مخبز لبنان</p>
    </div>

    <div v-if="loading" class="loading">جاري التحميل...</div>

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
            <span class="card-label">منتجات منخفضة المخزون</span>
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

      <div class="dashboard-grid">
        <div class="section recent-sales">
          <h3>🕐 آخر المبيعات</h3>
          <table v-if="recentSales.length">
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
                <td class="product-name">{{ sale.product_name }}</td>
                <td>{{ sale.quantity }}</td>
                <td class="price">{{ Number(sale.total_price).toLocaleString('ar-LB') }} ل.س</td>
                <td class="date">{{ new Date(sale.sold_at).toLocaleString('ar-LB') }}</td>
              </tr>
            </tbody>
          </table>
          <p v-else class="empty">لا توجد مبيعات بعد</p>
        </div>

        <div class="section quick-actions">
          <h3>⚡ إجراءات سريعة</h3>
          <div class="actions-grid">
            <a class="action-btn" href="/inventory">
              <span class="action-icon">📦</span>
              <span>إضافة مخزون</span>
            </a>
            <a class="action-btn" href="/sales">
              <span class="action-icon">💰</span>
              <span>تسجيل بيع</span>
            </a>
            <a class="action-btn" href="/products">
              <span class="action-icon">🔄</span>
              <span>مزامنة المنتجات</span>
            </a>
            <a class="action-btn" href="/workers">
              <span class="action-icon">👷</span>
              <span>إدارة العمال</span>
            </a>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.dashboard-header {
  margin-bottom: 1.5rem;
}

.dashboard-header h2 {
  margin-bottom: 0.3rem;
}

.welcome {
  color: var(--text-light);
  font-size: 0.95rem;
  padding-right: 1rem;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.card {
  background: var(--bg-card);
  border-radius: var(--radius);
  padding: 1.2rem;
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 4px;
  transition: height 0.3s ease;
}

.card-products::before { background: linear-gradient(90deg, #2d9f4e, #43a047); }
.card-revenue::before { background: linear-gradient(90deg, #c73e1d, #e85d2e); }
.card-sales::before { background: linear-gradient(90deg, #1565c0, #1976d2); }
.card-stock::before { background: linear-gradient(90deg, #795548, #8d6e63); }
.card-workers::before { background: linear-gradient(90deg, #6a1b9a, #8e24aa); }
.card.card-warning::before { background: linear-gradient(90deg, #ff6f00, #f5a623); }

.card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-hover);
}

.card:hover::before {
  height: 6px;
}

.card-icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.card-products .card-icon-box { background: rgba(45, 159, 78, 0.12); }
.card-revenue .card-icon-box { background: rgba(199, 62, 29, 0.12); }
.card-sales .card-icon-box { background: rgba(21, 101, 192, 0.12); }
.card-stock .card-icon-box { background: rgba(121, 85, 72, 0.12); }
.card-workers .card-icon-box { background: rgba(106, 27, 154, 0.12); }
.card-warning .card-icon-box { background: rgba(255, 111, 0, 0.12); }

.card-content {
  display: flex;
  flex-direction: column;
}

.card-label {
  font-size: 0.8rem;
  color: var(--text-light);
  font-weight: 600;
}

.card-value {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text);
  line-height: 1.2;
}

.card-value small {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--text-light);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 900px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

.recent-sales {
  background: var(--bg-card);
  border-radius: var(--radius);
  padding: 1.2rem;
  box-shadow: var(--shadow);
}

.recent-sales h3 {
  margin-bottom: 1rem;
}

.recent-sales table {
  box-shadow: none;
  border-radius: 0;
}

.product-name {
  font-weight: 600;
}

.price {
  font-weight: 700;
  color: var(--primary);
}

.date {
  font-size: 0.82rem;
  color: var(--text-light);
}

.empty {
  text-align: center;
  padding: 2rem;
  color: var(--text-light);
}

.quick-actions {
  background: var(--bg-card);
  border-radius: var(--radius);
  padding: 1.2rem;
  box-shadow: var(--shadow);
}

.actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  padding: 1rem;
  background: var(--bg);
  border-radius: 12px;
  text-decoration: none;
  color: var(--text);
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: var(--primary);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(199,62,29,0.3);
}

.action-icon {
  font-size: 1.5rem;
}
</style>
