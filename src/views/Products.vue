<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { api } from '@/api'

interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  created_at: string
}

const products = ref<Product[]>([])
const loading = ref(false)
const syncing = ref(false)
const message = ref('')
const showModal = ref(false)
const editProduct = ref<Product | null>(null)
const editForm = ref({ name: '', description: '', price: 0, category: '' })

const categoryColors: Record<string, string> = {
  'حلويات': '#e91e63',
  'كعك': '#ff6f00',
}

const groupedProducts = computed(() => {
  const groups: Record<string, Product[]> = {}
  for (const p of products.value) {
    if (!groups[p.category]) groups[p.category] = []
    groups[p.category]!.push(p)
  }
  return groups
})

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
    message.value = 'فشل التزامن'
  } finally {
    syncing.value = false
  }
}

function startEdit(product: Product) {
  editProduct.value = product
  editForm.value = { name: product.name, description: product.description, price: product.price, category: product.category }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editProduct.value = null
}

async function saveEdit() {
  if (!editProduct.value) return
  try {
    await api.products.update(editProduct.value.id, editForm.value)
    closeModal()
    await loadProducts()
  } catch (e) {
    console.error(e)
  }
}

async function deleteProduct(id: number) {
  if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return
  try {
    await api.products.delete(id)
    await loadProducts()
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <div>
    <div class="page-header">
      <h2>📦 المنتجات</h2>
      <button class="btn small" @click="syncProducts" :disabled="syncing">
        {{ syncing ? '⏳' : '🔄' }}
      </button>
    </div>
    <p v-if="message" class="message">{{ message }}</p>

    <div v-if="loading" class="loading">جاري التحميل...</div>

    <div v-else class="product-groups">
      <div v-for="(group, category) in groupedProducts" :key="category" style="background: var(--bg-card); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); margin-bottom: 10px;">
        <div :style="{ background: categoryColors[category] || '#795548', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' }">
          <h3 style="margin: 0; color: #fff; font-size: 0.9rem;">{{ category }}</h3>
          <span style="font-size: 0.7rem; opacity: 0.85; background: rgba(255,255,255,0.2); padding: 2px 8px; border-radius: 12px;">{{ group.length }}</span>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>الاسم</th>
                <th>السعر</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in group" :key="p.id">
                <td>{{ p.id }}</td>
                <td style="font-weight: 600;">{{ p.name }}</td>
                <td style="color: var(--primary); font-weight: 700;">{{ p.price.toLocaleString('ar-LB') }} ل.س</td>
                <td>
                  <div class="actions">
                    <button class="btn small" @click="startEdit(p)">تعديل</button>
                    <button class="btn small danger" @click="deleteProduct(p.id)">حذف</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

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
              <button type="button" class="btn outline" @click="closeModal">❌ إلغاء</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>
