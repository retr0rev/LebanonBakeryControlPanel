<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import { api } from '@/api'
api.init()

const route = useRoute()
const current = computed(() => route.name as string)
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="header-content">
        <div class="header-brand">
          <div class="brand-icon">🥖</div>
          <div class="brand-text">
            <div class="brand-title">مخبز لبنان</div>
            <div class="brand-subtitle">لوحة الإدارة</div>
          </div>
        </div>
        <div class="header-decoration"></div>
      </div>
    </header>

    <main class="app-main">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>

    <nav class="app-nav">
      <RouterLink to="/" :class="{ active: current === 'dashboard' }" class="nav-item">
        <div class="nav-icon-wrap">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
        </div>
        <span class="nav-label">الرئيسية</span>
      </RouterLink>
      <RouterLink to="/products" :class="{ active: current === 'products' }" class="nav-item">
        <div class="nav-icon-wrap">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
          </svg>
        </div>
        <span class="nav-label">المنتجات</span>
      </RouterLink>
      <RouterLink to="/inventory" :class="{ active: current === 'inventory' }" class="nav-item">
        <div class="nav-icon-wrap">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
          </svg>
        </div>
        <span class="nav-label">المخزون</span>
      </RouterLink>
      <RouterLink to="/sales" :class="{ active: current === 'sales' }" class="nav-item">
        <div class="nav-icon-wrap">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        <span class="nav-label">المبيعات</span>
      </RouterLink>
      <RouterLink to="/workers" :class="{ active: current === 'workers' }" class="nav-item">
        <div class="nav-icon-wrap">
          <svg class="nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <span class="nav-label">العمال</span>
      </RouterLink>
    </nav>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap');

:root {
  --bg: #f5f0ea;
  --surface: #ffffff;
  --primary: #c0392b;
  --primary-dark: #a93226;
  --primary-light: #e74c3c;
  --accent: #d4a04a;
  --accent-light: #f0d48a;
  --accent-dark: #b8863a;
  --text: #2c1810;
  --text-secondary: #7f6b5e;
  --text-muted: #b5a398;
  --border: #e8ddd2;
  --shadow-sm: 0 1px 3px rgba(44,24,16,0.08);
  --shadow-md: 0 4px 12px rgba(44,24,16,0.1);
  --shadow-lg: 0 8px 24px rgba(44,24,16,0.12);
  --radius: 12px;
  --radius-lg: 16px;
  --nav-height: 64px;
  --header-height: 56px;
  --safe-bottom: env(safe-area-inset-bottom, 0px);
}

* { margin: 0; padding: 0; box-sizing: border-box; }
* { -webkit-tap-highlight-color: transparent; }

body {
  font-family: 'Cairo', 'Segoe UI', sans-serif;
  background: var(--bg);
  color: var(--text);
  direction: rtl;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

.app-shell {
  min-height: 100vh;
  padding-bottom: calc(var(--nav-height) + var(--safe-bottom));
}

.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height);
  background: linear-gradient(135deg, #2c1810 0%, #4a2818 50%, #6b3a22 100%);
  z-index: 50;
  overflow: hidden;
}

.header-content {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 16px;
  position: relative;
}

.header-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--accent), var(--accent-light), var(--accent), transparent);
  opacity: 0.6;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-icon {
  font-size: 1.6rem;
  animation: gentleBounce 3s ease-in-out infinite;
}

@keyframes gentleBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.brand-text { line-height: 1.15; }

.brand-title {
  font-size: 1rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.5px;
}

.brand-subtitle {
  font-size: 0.6rem;
  color: rgba(255,255,255,0.5);
  font-weight: 500;
  letter-spacing: 1px;
}

.app-main {
  margin-top: var(--header-height);
  padding: 12px;
  max-width: 100%;
  overflow-x: hidden;
}

.app-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: calc(var(--nav-height) + var(--safe-bottom));
  padding-bottom: var(--safe-bottom);
  background: var(--surface);
  display: flex;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 -2px 12px rgba(44,24,16,0.1);
  z-index: 50;
  border-top: 1px solid var(--border);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  text-decoration: none;
  color: var(--text-muted);
  padding: 4px 8px;
  border-radius: 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  min-width: 48px;
}

.nav-item.active {
  color: var(--primary);
}

.nav-item.active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2.5px;
  background: var(--primary);
  border-radius: 0 0 3px 3px;
}

.nav-icon-wrap {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.nav-item.active .nav-icon-wrap {
  transform: translateY(-1px);
}

.nav-svg {
  width: 20px;
  height: 20px;
}

.nav-label {
  font-size: 0.55rem;
  font-weight: 600;
}

h2 {
  font-size: 1.15rem;
  font-weight: 800;
  margin-bottom: 12px;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 6px;
}

h3 {
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: var(--text);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.page-header h2 { margin-bottom: 0; }

.section {
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: 16px;
  box-shadow: var(--shadow-sm);
}

.loading {
  text-align: center;
  padding: 48px 16px;
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.loading::after {
  content: '';
  display: block;
  width: 32px;
  height: 32px;
  margin: 12px auto 0;
  border: 3px solid var(--border);
  border-top: 3px solid var(--primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.message {
  background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
  color: #2e7d32;
  padding: 10px 14px;
  border-radius: 10px;
  margin-bottom: 10px;
  font-size: 0.82rem;
  font-weight: 500;
  animation: slideDown 0.25s ease;
  border-right: 3px solid #43a047;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}

.cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 16px;
}

.card {
  background: var(--surface);
  border-radius: var(--radius);
  padding: 14px 12px;
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  gap: 10px;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  overflow: hidden;
}

.card:active {
  transform: scale(0.98);
}

.card-icon-box {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.card-content { display: flex; flex-direction: column; min-width: 0; }

.card-label {
  font-size: 0.68rem;
  color: var(--text-secondary);
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-value {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text);
  line-height: 1.2;
}

.card-value small {
  font-size: 0.6rem;
  font-weight: 600;
  color: var(--text-muted);
}

.card-products .card-icon-box { background: #e8f5e9; color: #2e7d32; }
.card-revenue .card-icon-box { background: #fce4ec; color: #c62828; }
.card-sales .card-icon-box { background: #e3f2fd; color: #1565c0; }
.card-stock .card-icon-box { background: #fff3e0; color: #e65100; }
.card-workers .card-icon-box { background: #f3e5f5; color: #6a1b9a; }
.card-warning .card-icon-box { background: #fff3e0; color: #bf360c; }
.card-warning { border: 1px solid #ffcc02; }

/* Table styles */
.table-wrap {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin: 0 -4px;
  padding: 0 4px;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.78rem;
  min-width: 420px;
}

thead th {
  background: #faf7f3;
  color: var(--text-secondary);
  font-weight: 700;
  font-size: 0.68rem;
  padding: 10px 8px;
  text-align: right;
  border-bottom: 2px solid var(--border);
  white-space: nowrap;
}

tbody td {
  padding: 10px 8px;
  border-bottom: 1px solid var(--border);
  color: var(--text);
}

tbody tr:last-child td { border-bottom: none; }

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 10px 18px;
  border: none;
  border-radius: 10px;
  font-family: 'Cairo', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--primary);
  color: #fff;
  box-shadow: 0 2px 8px rgba(192,57,43,0.25);
}

.btn:active {
  transform: scale(0.96);
  box-shadow: 0 1px 4px rgba(192,57,43,0.2);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn.small {
  padding: 6px 12px;
  font-size: 0.72rem;
  border-radius: 8px;
  box-shadow: none;
}

.btn.danger {
  background: #c62828;
  box-shadow: 0 2px 8px rgba(198,40,40,0.25);
}

.btn.outline {
  background: transparent;
  border: 1.5px solid var(--primary);
  color: var(--primary);
  box-shadow: none;
}

.btn.outline:active {
  background: var(--primary);
  color: #fff;
}

.actions {
  display: flex;
  gap: 6px;
}

.qty-input {
  padding: 6px 8px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  font-family: 'Cairo', sans-serif;
  font-size: 0.82rem;
  text-align: center;
  background: #fdfcfa;
  color: var(--text);
  transition: border-color 0.2s;
  width: 64px;
}

.qty-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(212,160,74,0.15);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(44,24,16,0.5);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 100;
  padding: 16px;
  animation: overlayIn 0.2s ease;
}

@keyframes overlayIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal {
  background: var(--surface);
  border-radius: 20px 20px 0 0;
  padding: 24px 20px calc(20px + var(--safe-bottom));
  width: 100%;
  max-width: 400px;
  box-shadow: 0 -8px 32px rgba(44,24,16,0.15);
  animation: modalSlideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes modalSlideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.modal h3 {
  font-size: 1rem;
  margin-bottom: 16px;
  text-align: center;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}

.modal label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: var(--text);
  font-size: 0.78rem;
}

.modal label input,
.modal label select {
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  margin-top: 4px;
  font-family: 'Cairo', sans-serif;
  font-size: 0.85rem;
  background: #fdfcfa;
  color: var(--text);
  transition: border-color 0.2s;
}

.modal label input:focus,
.modal label select:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(212,160,74,0.12);
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.form-actions .btn { flex: 1; }

form input,
form select {
  padding: 10px 12px;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  font-family: 'Cairo', sans-serif;
  font-size: 0.85rem;
  background: #fdfcfa;
  color: var(--text);
  transition: border-color 0.2s;
}

form input:focus,
form select:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(212,160,74,0.12);
}

form select { min-width: 0; }

/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.page-enter-from { opacity: 0; transform: translateY(8px); }
.page-leave-to { opacity: 0; transform: translateY(-8px); }

/* Modal transitions */
.modal-enter-active { animation: modalSlideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.modal-leave-active { animation: modalSlideUp 0.2s ease reverse; }

/* Scrollbar */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
</style>
