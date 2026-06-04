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

function categoryStyle(cat: string) {
  const bg = categoryColors[cat] || '#795548'
  return { background: bg }
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
  editForm.value = {
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
  }
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
  <div class="page">
    <div class="page-header">
      <h2>المنتجات</h2>
      <button class="btn" @click="syncProducts" :disabled="syncing">
        <span>{{ syncing ? '⏳' : '🔄' }}</span>
        {{ syncing ? 'جاري التزامن...' : 'مزامنة من الموقع' }}
      </button>
    </div>
    <p v-if="message" class="message">{{ message }}</p>

    <div v-if="loading" class="loading">جاري التحميل...</div>

    <div v-else class="product-groups">
      <div v-for="(group, category) in groupedProducts" :key="category" class="category-group">
        <div class="category-header" :style="categoryStyle(category)">
          <h3>{{ category }}</h3>
          <span class="count">{{ group.length }} منتج</span>
        </div>
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
              <td class="product-name">{{ p.name }}</td>
              <td class="price">{{ p.price.toLocaleString('ar-LB') }} ل.س</td>
              <td class="actions">
                <button class="btn small" @click="startEdit(p)">تعديل</button>
                <button class="btn small danger" @click="deleteProduct(p.id)">حذف</button>
              </td>
            </tr>
          </tbody>
        </table>
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

<style scoped>
.product-groups {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.category-group {
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  background: var(--bg-card);
}

.category-header {
  padding: 0.8rem 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
}

.category-header h3 {
  margin: 0;
  color: #fff;
  font-size: 1rem;
}

.count {
  font-size: 0.8rem;
  opacity: 0.85;
  background: rgba(255,255,255,0.2);
  padding: 0.2rem 0.7rem;
  border-radius: 20px;
}

.category-group table {
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
</style>
