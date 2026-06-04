<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const current = computed(() => route.name as string)
</script>

<template>
  <div class="layout">
    <header class="top-bar">
      <div class="top-bar-title">
        <span class="top-logo">🥖</span>
        <div class="top-text">
          <span class="top-name">مخبز لبنان</span>
          <span class="top-sub">لوحة التحكم</span>
        </div>
      </div>
    </header>
    <main class="main">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <nav class="bottom-nav">
      <RouterLink to="/" :class="{ active: current === 'dashboard' }">
        <span class="nav-icon">📊</span>
        <span class="nav-label">الرئيسية</span>
      </RouterLink>
      <RouterLink to="/products" :class="{ active: current === 'products' }">
        <span class="nav-icon">📦</span>
        <span class="nav-label">المنتجات</span>
      </RouterLink>
      <RouterLink to="/inventory" :class="{ active: current === 'inventory' }">
        <span class="nav-icon">🏪</span>
        <span class="nav-label">المخزون</span>
      </RouterLink>
      <RouterLink to="/sales" :class="{ active: current === 'sales' }">
        <span class="nav-icon">💰</span>
        <span class="nav-label">المبيعات</span>
      </RouterLink>
      <RouterLink to="/workers" :class="{ active: current === 'workers' }">
        <span class="nav-icon">👷</span>
        <span class="nav-label">العمال</span>
      </RouterLink>
    </nav>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');

:root {
  --primary: #c73e1d;
  --primary-light: #e85d2e;
  --primary-dark: #a02e12;
  --secondary: #f5a623;
  --accent: #2d9f4e;
  --bg: #faf3e8;
  --bg-card: #ffffff;
  --text: #2c1810;
  --text-light: #8d6e63;
  --shadow: 0 2px 8px rgba(0,0,0,0.08);
  --radius: 10px;
  --gradient: linear-gradient(135deg, #c73e1d, #e85d2e);
  --nav-height: 62px;
  --topbar-height: 52px;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Cairo', sans-serif;
  background: var(--bg);
  color: var(--text);
  direction: rtl;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  overscroll-behavior: none;
}

.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-bottom: var(--nav-height);
}

.top-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--topbar-height);
  background: linear-gradient(135deg, #2c1810, #4a2c1a);
  display: flex;
  align-items: center;
  padding: 0 12px;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.top-bar-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.top-logo {
  font-size: 1.4rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.top-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.top-name {
  font-size: 0.95rem;
  font-weight: 800;
  color: #fff;
}

.top-sub {
  font-size: 0.6rem;
  color: rgba(255,255,255,0.5);
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--nav-height);
  background: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.08);
  z-index: 100;
  padding: 4px 0;
  direction: rtl;
}

.bottom-nav a {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  text-decoration: none;
  color: var(--text-light);
  padding: 4px 8px;
  border-radius: 8px;
  transition: all 0.2s;
  min-width: 56px;
}

.bottom-nav a.active {
  color: var(--primary);
}

.nav-icon {
  font-size: 1.3rem;
  line-height: 1;
}

.nav-label {
  font-size: 0.6rem;
  font-weight: 600;
}

.main {
  flex: 1;
  margin-top: var(--topbar-height);
  padding: 12px;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

h2 {
  font-size: 1.2rem;
  margin-bottom: 12px;
  color: var(--text);
  font-weight: 800;
  position: relative;
  padding-right: 10px;
}

h2::before {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background: var(--gradient);
  border-radius: 2px;
}

h3 {
  font-size: 0.95rem;
  margin-bottom: 10px;
  color: var(--text);
  font-weight: 700;
}

.loading {
  text-align: center;
  padding: 2rem 1rem;
  color: var(--text-light);
  font-size: 0.9rem;
}

.loading::after {
  content: '';
  display: block;
  width: 32px;
  height: 32px;
  margin: 10px auto 0;
  border: 3px solid var(--bg);
  border-top: 3px solid var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.message {
  background: linear-gradient(135deg, #d4edda, #c3e6cb);
  color: #155724;
  padding: 8px 12px;
  border-radius: 8px;
  margin-bottom: 10px;
  font-size: 0.85rem;
  animation: slideDown 0.3s ease;
  border-right: 3px solid #28a745;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.card {
  background: var(--bg-card);
  border-radius: var(--radius);
  padding: 12px;
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-icon-box {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.card-content {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.card-label {
  font-size: 0.7rem;
  color: var(--text-light);
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-value {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text);
  line-height: 1.2;
}

.card-value small {
  font-size: 0.6rem;
  font-weight: 600;
  color: var(--text-light);
}

table {
  width: 100%;
  background: var(--bg-card);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  border-collapse: collapse;
  font-size: 0.8rem;
}

thead {
  background: linear-gradient(135deg, #2c1810, #4a2c1a);
}

th {
  padding: 10px 8px;
  text-align: right;
  font-weight: 600;
  color: #fff;
  font-size: 0.72rem;
  white-space: nowrap;
}

td {
  padding: 10px 8px;
  border-bottom: 1px solid #f0ebe4;
  color: var(--text);
}

tr:last-child td { border-bottom: none; }

tbody tr:active {
  background: rgba(199,62,29,0.06);
}

tr.low-stock { background: #fff8e1; }

.badge {
  background: linear-gradient(135deg, #dc3545, #c82333);
  color: #fff;
  padding: 1px 6px;
  border-radius: 12px;
  font-size: 0.6rem;
  font-weight: 600;
  display: inline-block;
}

.btn {
  background: var(--gradient);
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Cairo', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  -webkit-tap-highlight-color: transparent;
}

.btn:active {
  transform: scale(0.97);
  opacity: 0.9;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn.small {
  padding: 5px 10px;
  font-size: 0.72rem;
  border-radius: 6px;
}

.btn.danger {
  background: linear-gradient(135deg, #dc3545, #c82333);
}

.btn.outline {
  background: transparent;
  border: 1.5px solid var(--primary);
  color: var(--primary);
}

.actions {
  display: flex;
  gap: 4px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.page-header h2 {
  margin-bottom: 0;
}

.qty-input {
  width: 60px;
  padding: 4px 6px;
  border: 1.5px solid #e0d6cc;
  border-radius: 6px;
  text-align: center;
  font-family: 'Cairo', sans-serif;
  font-size: 0.8rem;
  background: #fdfaf7;
}

.qty-input:focus {
  outline: none;
  border-color: var(--primary);
}

.add-stock {
  display: flex;
  gap: 4px;
  align-items: center;
}

/* Table wrapper for horizontal scroll */
.table-wrap {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(44, 24, 16, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 16px;
}

.modal {
  background: var(--bg-card);
  border-radius: 14px;
  padding: 20px;
  width: 100%;
  max-width: 360px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  animation: modalIn 0.25s ease;
}

@keyframes modalIn {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.modal h3 {
  margin-bottom: 16px;
  font-size: 1rem;
}

.modal label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: var(--text);
  font-size: 0.82rem;
}

.modal label input,
.modal label select {
  width: 100%;
  padding: 8px 10px;
  border: 1.5px solid #e0d6cc;
  border-radius: 8px;
  margin-top: 4px;
  font-family: 'Cairo', sans-serif;
  font-size: 0.85rem;
  background: #fdfaf7;
}

.modal label input:focus,
.modal label select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(199,62,29,0.1);
}

.form-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

form input,
form select {
  padding: 8px 10px;
  border: 1.5px solid #e0d6cc;
  border-radius: 8px;
  font-family: 'Cairo', sans-serif;
  font-size: 0.85rem;
  background: #fdfaf7;
}

form input:focus,
form select:focus {
  outline: none;
  border-color: var(--primary);
}

.section {
  background: var(--bg-card);
  border-radius: var(--radius);
  padding: 14px;
  box-shadow: var(--shadow);
}

.section h3 { margin-bottom: 10px; }

/* Page transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from { opacity: 0; transform: translateY(8px); }
.fade-leave-to { opacity: 0; transform: translateY(-8px); }

/* Scrollbar */
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: #d4c9bc; border-radius: 4px; }

/* Selection colors per card */
.card-products .card-icon-box { background: rgba(45, 159, 78, 0.12); }
.card-revenue .card-icon-box { background: rgba(199, 62, 29, 0.12); }
.card-sales .card-icon-box { background: rgba(21, 101, 192, 0.12); }
.card-stock .card-icon-box { background: rgba(121, 85, 72, 0.12); }
.card-workers .card-icon-box { background: rgba(106, 27, 154, 0.12); }
.card-warning .card-icon-box { background: rgba(255, 111, 0, 0.12); }
</style>
