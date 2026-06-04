<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/api'

interface InventoryItem {
  product_id: number
  quantity: number
  product_name: string
  category: string
  price: number
  updated_at: string
}

const items = ref<InventoryItem[]>([])
const loading = ref(false)
const addQty = ref<Record<number, number>>({})
const message = ref('')

const maxStock = ref(100)

onMounted(() => loadInventory())

async function loadInventory() {
  loading.value = true
  try {
    items.value = await api.inventory.list()
    maxStock.value = Math.max(1, ...items.value.map(i => i.quantity), 100)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function addStock(productId: number) {
  const qty = addQty.value[productId]
  if (!qty || qty <= 0) return
  try {
    await api.inventory.add(productId, qty)
    addQty.value[productId] = 0
    message.value = `✅ تمت إضافة ${qty} قطعة بنجاح`
    setTimeout(() => message.value = '', 2500)
    await loadInventory()
  } catch (e) {
    console.error(e)
  }
}

async function setStock(productId: number, quantity: number) {
  if (quantity < 0) quantity = 0
  try {
    await api.inventory.update(productId, quantity)
    await loadInventory()
  } catch (e) {
    console.error(e)
  }
}

function stockPercent(qty: number): number {
  return Math.min(100, (qty / maxStock.value) * 100)
}

function stockColor(qty: number): string {
  if (qty === 0) return '#dc3545'
  if (qty < 10) return '#ff6f00'
  if (qty < 30) return '#f5a623'
  return '#2d9f4e'
}
</script>

<template>
  <div class="page">
    <h2>🏪 المخزون</h2>
    <p v-if="message" class="message">{{ message }}</p>

    <div v-if="loading" class="loading">جاري التحميل...</div>

    <div v-else class="inventory-grid">
      <div v-for="item in items" :key="item.product_id" class="stock-card"
           :class="{ 'low-stock-card': item.quantity < 10 }">
        <div class="stock-header">
          <h3>{{ item.product_name }}</h3>
          <span class="category-tag" :style="{ background: item.category === 'حلويات' ? '#e91e63' : '#ff6f00' }">
            {{ item.category }}
          </span>
        </div>
        <div class="stock-body">
          <div class="stock-bar-container">
            <div class="stock-bar" :style="{ width: stockPercent(item.quantity) + '%', background: stockColor(item.quantity) }"></div>
          </div>
          <div class="stock-info">
            <div class="stock-qty">
              <strong :style="{ color: stockColor(item.quantity) }">{{ item.quantity }}</strong>
              <span>قطعة</span>
            </div>
            <div class="stock-price">{{ item.price.toLocaleString('ar-LB') }} ل.س</div>
          </div>
          <div class="stock-edit">
            <label>تحديد الكمية:</label>
            <input type="number" :value="item.quantity"
                   @change="(e) => setStock(item.product_id, parseInt((e.target as HTMLInputElement).value) || 0)"
                   class="qty-input" min="0" />
          </div>
          <div class="stock-add">
            <label>إضافة كمية:</label>
            <div class="add-row">
              <input type="number" v-model.number="addQty[item.product_id]"
                     placeholder="الكمية" min="1" class="qty-input" />
              <button class="btn small" @click="addStock(item.product_id)">➕ إضافة</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.inventory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
}

.stock-card {
  background: var(--bg-card);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
}

.stock-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-hover);
}

.stock-card.low-stock-card {
  border-right: 4px solid #ff6f00;
}

.stock-header {
  background: linear-gradient(135deg, #2c1810, #4a2c1a);
  color: #fff;
  padding: 0.8rem 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stock-header h3 {
  margin: 0;
  color: #fff;
  font-size: 0.95rem;
}

.category-tag {
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  color: #fff;
  font-weight: 600;
}

.stock-body {
  padding: 1rem 1.2rem;
}

.stock-bar-container {
  height: 8px;
  background: #f0ebe4;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.8rem;
}

.stock-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease, background 0.3s;
}

.stock-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.stock-qty {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
}

.stock-qty strong {
  font-size: 1.3rem;
  font-weight: 800;
}

.stock-qty span {
  font-size: 0.8rem;
  color: var(--text-light);
}

.stock-price {
  font-size: 0.85rem;
  color: var(--primary);
  font-weight: 700;
}

.stock-edit,
.stock-add {
  margin-bottom: 0.6rem;
}

.stock-edit label,
.stock-add label {
  display: block;
  font-size: 0.8rem;
  color: var(--text-light);
  margin-bottom: 0.3rem;
  font-weight: 600;
}

.add-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
</style>
