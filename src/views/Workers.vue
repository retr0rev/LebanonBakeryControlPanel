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
  <div class="page">
    <div class="page-header">
      <h2>العمال</h2>
      <button class="btn" @click="openAdd">إضافة عامل</button>
    </div>

    <div v-if="loading" class="loading">جاري التحميل...</div>

    <table v-else>
      <thead>
        <tr>
          <th>#</th>
          <th>الاسم</th>
          <th>الوظيفة</th>
          <th>الراتب الأسبوعي</th>
          <th>الهاتف</th>
          <th>إجراءات</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="w in workers" :key="w.id">
          <td>{{ w.id }}</td>
          <td>{{ w.name }}</td>
          <td>{{ w.job }}</td>
          <td>{{ w.weekly_salary }} ل.س</td>
          <td>{{ w.phone }}</td>
          <td class="actions">
            <button class="btn small" @click="openEdit(w)">تعديل</button>
            <button class="btn small danger" @click="deleteWorker(w.id!)">حذف</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal for Add/Edit -->
    <Transition name="modal">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <h3>{{ editingWorker ? 'تعديل عامل' : 'إضافة عامل' }}</h3>
          <form @submit.prevent="save">
            <label>الاسم <input v-model="form.name" required /></label>
            <label>الوظيفة <input v-model="form.job" required /></label>
            <label>الراتب الأسبوعي <input v-model.number="form.weekly_salary" type="number" required /></label>
            <label>الهاتف <input v-model="form.phone" /></label>
            <div class="form-actions">
              <button type="submit" class="btn">حفظ</button>
              <button type="button" class="btn" @click="closeModal">إلغاء</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>
