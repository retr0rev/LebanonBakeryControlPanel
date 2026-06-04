<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { api } from '@/api'

interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
}

const products = ref<Product[]>([])
const loading = ref(false)
const syncing = ref(false)
const message = ref('')
const showModal = ref(false)
const editProduct = ref<Product | null>(null)
const editForm = ref({ name: '', description: '', price: 0, category: '' })

const categories = computed(() => {
  const m: Record<string, Product[]> = {}
  for (const p of products.value) {
    if (!m[p.category]) m[p.category] = []
    m[p.category]!.push(p)
  }
  return m
})

const catStyles: Record<string, string> = {
  'حلويات': '#e8a0b4',
  'كعك': '#d4a04a',
}

onMounted(() => loadProducts())

async function loadProducts() {
  loading.value = true
  try {
    products.value = await api.products.list()
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function syncProducts() {
  syncing.value = true
  message.value = ''
  try {
    const res = await api.products.sync()
    message.value = res.message
    await loadProducts()
  } catch (e) {
    message.value = '❌ ' + (e as Error).message
  } finally {
    syncing.value = false
    setTimeout(() => message.value = '', 3000)
  }
}

function startEdit(p: Product) {
  editProduct.value = p
  editForm.value = { name: p.name, description: p.description, price: p.price, category: p.category }
  showModal.value = true
}

function closeModal() { showModal.value = false; editProduct.value = null }

async function saveEdit() {
  if (!editProduct.value) return
  try {
    await api.products.update(editProduct.value.id, editForm.value)
    closeModal()
    await loadProducts()
  } catch (e) { console.error(e) }
}

async function deleteProduct(id: number) {
  if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return
  try { await api.products.delete(id); await loadProducts() } catch (e) { console.error(e) }
}
</script>

<template>
  <div>
    <div class="page-header">
      <h2 style="margin:0">📦 المنتجات</h2>
      <button class="btn small" @click="syncProducts" :disabled="syncing" style="white-space:nowrap">
        {{ syncing ? '...جاري' : '🔄 مزامنة' }}
      </button>
    </div>
    <p v-if="message" class="message">{{ message }}</p>

    <div v-if="loading" class="loading">جاري التحميل...</div>

    <template v-else>
      <div v-for="(group, cat) in categories" :key="cat" style="margin-bottom: 12px;">
        <div class="section" style="padding: 0; overflow: hidden;">
          <div :style="{ background: catStyles[cat] || '#b5a398', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }">
            <span style="color: #fff; font-weight: 700; font-size: 0.82rem;">{{ cat }}</span>
            <span style="color: rgba(255,255,255,0.8); font-size: 0.7rem; background: rgba(255,255,255,0.2); padding: 2px 10px; border-radius: 12px;">{{ group.length }}</span>
          </div>
          <div style="display: flex; flex-direction: column;">
            <div v-for="p in group" :key="p.id" style="display: flex; align-items: center; padding: 10px 14px; border-bottom: 1px solid var(--border); gap: 8px;">
              <div style="flex: 1; min-width: 0;">
                <div style="font-weight: 600; font-size: 0.85rem;">{{ p.name }}</div>
                <div style="font-size: 0.72rem; color: var(--primary); font-weight: 700;">{{ p.price.toLocaleString('ar-LB') }} ل.س</div>
              </div>
              <div class="actions">
                <button class="btn small" @click="startEdit(p)">تعديل</button>
                <button class="btn small danger" @click="deleteProduct(p.id)">حذف</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <Transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <h3>✏️ تعديل المنتج</h3>
          <form @submit.prevent="saveEdit">
            <label>الاسم <input v-model="editForm.name" required /></label>
            <label>الوصف <input v-model="editForm.description" /></label>
            <label>السعر <input v-model.number="editForm.price" type="number" required /></label>
            <label>التصنيف <input v-model="editForm.category" required /></label>
            <div class="form-actions">
              <button type="submit" class="btn">💾 حفظ</button>
              <button type="button" class="btn outline" @click="closeModal">إلغاء</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>
