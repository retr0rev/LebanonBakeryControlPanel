<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/api'

interface InvItem {
  product_id: number
  quantity: number
  product_name: string
  category: string
  price: number
}

const items = ref<InvItem[]>([])
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

async function addStock(id: number) {
  const q = addQty.value[id]
  if (!q || q <= 0) return
  try {
    await api.inventory.add(id, q)
    addQty.value[id] = 0
    message.value = `✅ تمت إضافة ${q} قطعة`
    setTimeout(() => message.value = '', 2000)
    await loadInventory()
  } catch (e) { console.error(e) }
}

async function setStock(id: number, q: number) {
  if (q < 0) q = 0
  try { await api.inventory.update(id, q); await loadInventory() } catch (e) { console.error(e) }
}

function pct(q: number) { return Math.min(100, (q / maxStock.value) * 100) }
function color(q: number) {
  if (q === 0) return '#c62828'
  if (q < 10) return '#e65100'
  if (q < 30) return '#f9a825'
  return '#2e7d32'
}
</script>

<template>
  <div>
    <h2>🏪 المخزون</h2>
    <p v-if="message" class="message">{{ message }}</p>

    <div v-if="loading" class="loading">جاري التحميل...</div>

    <div v-else style="display: flex; flex-direction: column; gap: 10px;">
      <div v-for="item in items" :key="item.product_id"
           class="section"
           :style="item.quantity < 10 ? { borderRight: '3px solid #e65100' } : {}">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div>
            <div style="font-weight: 700; font-size: 0.88rem;">{{ item.product_name }}</div>
            <div style="font-size: 0.68rem; color: var(--text-muted);">{{ item.category }}</div>
          </div>
          <div style="text-align: left;">
            <div :style="{ color: color(item.quantity), fontSize: '1.1rem', fontWeight: 800 }">{{ item.quantity }}</div>
            <div style="font-size: 0.6rem; color: var(--text-muted);">قطعة</div>
          </div>
        </div>

        <div style="height: 6px; background: #f0ebe4; border-radius: 3px; overflow: hidden; margin-bottom: 10px;">
          <div :style="{ width: pct(item.quantity) + '%', height: '100%', background: color(item.quantity), borderRadius: '3px', transition: 'width 0.4s ease' }"></div>
        </div>

        <div style="display: flex; gap: 8px;">
          <div style="flex: 1;">
            <label style="font-size: 0.65rem; color: var(--text-muted); font-weight: 600; display: block; margin-bottom: 4px;">تحديد الكمية</label>
            <input type="number" :value="item.quantity"
                   @change="(e) => setStock(item.product_id, parseInt((e.target as HTMLInputElement).value) || 0)"
                   class="qty-input" min="0" style="width: 100%;" />
          </div>
          <div style="flex: 1;">
            <label style="font-size: 0.65rem; color: var(--text-muted); font-weight: 600; display: block; margin-bottom: 4px;">إضافة كمية</label>
            <div style="display: flex; gap: 4px;">
              <input type="number" v-model.number="addQty[item.product_id]" placeholder="الكمية" min="1" class="qty-input" style="flex: 1;" />
              <button class="btn small" @click="addStock(item.product_id)" style="padding: 6px 10px;">➕</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
