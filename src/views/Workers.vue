<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { api } from '@/api'

interface Worker {
  id?: number
  name: string
  job: string
  weekly_salary: number
  phone: string
  created_at: string
}

const workers = ref<Worker[]>([])
const loading = ref(false)
const showModal = ref(false)
const editingWorker = ref<Worker | null>(null)
const form = ref({ name: '', job: '', weekly_salary: 0, phone: '' })

onMounted(() => loadWorkers())

async function loadWorkers() {
  loading.value = true
  try {
    workers.value = await api.workers.list()
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function openAdd() {
  editingWorker.value = null
  form.value = { name: '', job: '', weekly_salary: 0, phone: '' }
  showModal.value = true
}

function openEdit(w: Worker) {
  editingWorker.value = w
  form.value = { name: w.name, job: w.job, weekly_salary: w.weekly_salary, phone: w.phone }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingWorker.value = null
}

async function save() {
  if (!form.value.name || !form.value.job || !form.value.weekly_salary) return
  try {
    if (editingWorker.value && editingWorker.value.id != null) {
      await api.workers.update(editingWorker.value.id, form.value)
    } else {
      await api.workers.create(form.value)
    }
    closeModal()
    await loadWorkers()
  } catch (e) {
    console.error(e)
  }
}

async function deleteWorker(id: number) {
  if (!confirm('هل أنت متأكد من حذف هذا العامل؟')) return
  try {
    await api.workers.delete(id)
    await loadWorkers()
  } catch (e) {
    console.error(e)
  }
}
</script>

<template>
  <div>
    <div class="page-header">
      <h2>👷 العمال</h2>
      <button class="btn small" @click="openAdd">➕ إضافة</button>
    </div>

    <div v-if="loading" class="loading">جاري التحميل...</div>

    <div v-else-if="workers.length" style="display: flex; flex-direction: column; gap: 10px;">
      <div v-for="w in workers" :key="w.id"
           style="background: var(--bg-card); border-radius: var(--radius); padding: 12px; box-shadow: var(--shadow);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          <div>
            <div style="font-weight: 700; font-size: 0.95rem;">{{ w.name }}</div>
            <div style="font-size: 0.75rem; color: var(--text-light);">{{ w.job }}</div>
          </div>
          <div style="text-align: left;">
            <div style="font-weight: 800; color: var(--primary); font-size: 0.9rem;">{{ w.weekly_salary.toLocaleString('ar-LB') }} ل.س</div>
            <div style="font-size: 0.7rem; color: var(--text-light);">أسبوعياً</div>
          </div>
        </div>
        <div v-if="w.phone" style="font-size: 0.78rem; color: var(--text-light); margin-bottom: 8px;">📞 {{ w.phone }}</div>
        <div class="actions" style="justify-content: flex-end;">
          <button class="btn small" @click="openEdit(w)">تعديل</button>
          <button class="btn small danger" @click="deleteWorker(w.id!)">حذف</button>
        </div>
      </div>
    </div>
    <p v-else style="text-align: center; padding: 2rem; color: var(--text-light);">لا يوجد عمال بعد</p>

    <Transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <h3>{{ editingWorker ? '✏️ تعديل عامل' : '➕ إضافة عامل' }}</h3>
          <form @submit.prevent="save">
            <label>الاسم <input v-model="form.name" required /></label>
            <label>الوظيفة <input v-model="form.job" required /></label>
            <label>الراتب الأسبوعي <input v-model.number="form.weekly_salary" type="number" required /></label>
            <label>الهاتف <input v-model="form.phone" /></label>
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
