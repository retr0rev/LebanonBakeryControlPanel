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
    message.value = `✅ تمت إضافة ${qty} قطعة`
    setTimeout(() => message.value = '', 2000)
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
  <div>
    <h2>🏪 المخزون</h2>
    <p v-if="message" class="message">{{ message }}</p>

    <div v-if="loading" class="loading">جاري التحميل...</div>

    <div v-else style="display: flex; flex-direction: column; gap: 10px;">
      <div v-for="item in items" :key="item.product_id"
           style="background: var(--bg-card); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow);"
           :style="item.quantity < 10 ? { borderRight: '3px solid #ff6f00' } : {}">
        <div style="background: linear-gradient(135deg, #2c1810, #4a2c1a); color: #fff; padding: 8px 12px; display: flex; justify-content: space-between; align-items: center;">
          <h3 style="margin: 0; color: #fff; font-size: 0.85rem;">{{ item.product_name }}</h3>
          <span style="font-size: 0.65rem; padding: 2px 8px; border-radius: 12px; background: rgba(255,255,255,0.15);">
            {{ item.category }}
          </span>
        </div>
        <div style="padding: 10px 12px;">
          <div style="height: 6px; background: #f0ebe4; border-radius: 3px; overflow: hidden; margin-bottom: 8px;">
            <div :style="{ width: stockPercent(item.quantity) + '%', height: '100%', background: stockColor(item.quantity), borderRadius: '3px', transition: 'width 0.4s' }"></div>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div>
              <strong :style="{ color: stockColor(item.quantity), fontSize: '1.1rem' }">{{ item.quantity }}</strong>
              <span style="font-size: 0.75rem; color: var(--text-light); margin-right: 4px;">قطعة</span>
            </div>
            <span style="font-size: 0.8rem; color: var(--primary); font-weight: 700;">{{ item.price.toLocaleString('ar-LB') }} ل.س</span>
          </div>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 0;">
              <label style="font-size: 0.7rem; color: var(--text-light); font-weight: 600; display: block; margin-bottom: 4px;">تحديد</label>
              <input type="number" :value="item.quantity" @change="(e) => setStock(item.product_id, parseInt((e.target as HTMLInputElement).value) || 0)" class="qty-input" min="0" style="width: 100%;" />
            </div>
            <div style="flex: 1; min-width: 0;">
              <label style="font-size: 0.7rem; color: var(--text-light); font-weight: 600; display: block; margin-bottom: 4px;">إضافة</label>
              <div style="display: flex; gap: 4px;">
                <input type="number" v-model.number="addQty[item.product_id]" placeholder="كمية" min="1" class="qty-input" style="flex: 1;" />
                <button class="btn small" @click="addStock(item.product_id)" style="white-space: nowrap;">➕</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
