<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const current = computed(() => route.name as string)
</script>

<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="logo">
        <span class="logo-icon">🥖</span>
        <span>مخبز لبنان</span>
        <span class="logo-sub">Bakery Control Panel</span>
      </div>
      <nav>
        <RouterLink to="/" :class="{ active: current === 'dashboard' }">
          <span class="nav-icon">📊</span>
          <span>لوحة التحكم</span>
        </RouterLink>
        <RouterLink to="/products" :class="{ active: current === 'products' }">
          <span class="nav-icon">📦</span>
          <span>المنتجات</span>
        </RouterLink>
        <RouterLink to="/inventory" :class="{ active: current === 'inventory' }">
          <span class="nav-icon">🏪</span>
          <span>المخزون</span>
        </RouterLink>
        <RouterLink to="/sales" :class="{ active: current === 'sales' }">
          <span class="nav-icon">💰</span>
          <span>المبيعات</span>
        </RouterLink>
        <RouterLink to="/workers" :class="{ active: current === 'workers' }">
          <span class="nav-icon">👷</span>
          <span>العمال</span>
        </RouterLink>
      </nav>
      <div class="sidebar-footer">
        <span>🍞 جودة ونكهة</span>
      </div>
    </aside>
    <main class="main">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
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
  --shadow: 0 4px 16px rgba(0,0,0,0.08);
  --shadow-hover: 0 8px 24px rgba(0,0,0,0.12);
  --radius: 14px;
  --gradient: linear-gradient(135deg, #c73e1d, #e85d2e);
  --gradient-hover: linear-gradient(135deg, #a02e12, #c73e1d);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Cairo', sans-serif;
  background: var(--bg);
  color: var(--text);
  direction: rtl;
  line-height: 1.6;
}

.layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  background: linear-gradient(180deg, #2c1810 0%, #4a2c1a 100%);
  color: #fff;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  z-index: 100;
  box-shadow: 2px 0 20px rgba(0,0,0,0.15);
}

.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.2rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  margin-bottom: 1.5rem;
  gap: 0.2rem;
}

.logo-icon {
  font-size: 2.2rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.logo span:nth-child(2) {
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: 1px;
}

.logo-sub {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.5);
  font-weight: 400;
  letter-spacing: 0.5px;
}

.sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
}

.sidebar nav a {
  color: rgba(255,255,255,0.65);
  text-decoration: none;
  padding: 0.8rem 1rem;
  border-radius: 10px;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  position: relative;
  overflow: hidden;
}

.sidebar nav a::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%) scaleY(0);
  width: 3px;
  height: 60%;
  background: var(--secondary);
  border-radius: 0 3px 3px 0;
  transition: transform 0.3s ease;
}

.sidebar nav a:hover {
  background: rgba(255,255,255,0.08);
  color: #fff;
  transform: translateX(-4px);
}

.sidebar nav a.active {
  background: rgba(245, 166, 35, 0.15);
  color: var(--secondary);
}

.sidebar nav a.active::before {
  transform: translateY(-50%) scaleY(1);
}

.nav-icon {
  font-size: 1.2rem;
  width: 28px;
  text-align: center;
}

.sidebar-footer {
  padding: 1rem 0;
  text-align: center;
  font-size: 0.8rem;
  color: rgba(255,255,255,0.35);
  border-top: 1px solid rgba(255,255,255,0.08);
}

.main {
  flex: 1;
  margin-right: 250px;
  padding: 2rem;
  min-height: 100vh;
}

h2 {
  font-size: 1.6rem;
  margin-bottom: 1.5rem;
  color: var(--text);
  font-weight: 800;
  position: relative;
  padding-right: 1rem;
}

h2::before {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 70%;
  background: var(--gradient);
  border-radius: 2px;
}

h3 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: var(--text);
  font-weight: 700;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: var(--text-light);
  font-size: 1rem;
}

.loading::after {
  content: '';
  display: block;
  width: 40px;
  height: 40px;
  margin: 1rem auto;
  border: 4px solid var(--bg);
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.message {
  background: linear-gradient(135deg, #d4edda, #c3e6cb);
  color: #155724;
  padding: 0.75rem 1.2rem;
  border-radius: 10px;
  margin-bottom: 1rem;
  animation: slideDown 0.3s ease;
  border-right: 4px solid #28a745;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.card {
  background: var(--bg-card);
  border-radius: var(--radius);
  padding: 1.3rem 1.5rem;
  box-shadow: var(--shadow);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  cursor: default;
  position: relative;
  overflow: hidden;
}

.card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--gradient);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}

.card:hover::after {
  transform: scaleX(1);
}

.card-icon {
  font-size: 2.2rem;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(199,62,29,0.08), rgba(245,166,35,0.08));
  border-radius: 12px;
}

.card-info {
  display: flex;
  flex-direction: column;
}

.card-info strong {
  font-size: 1.5rem;
  color: var(--text);
  font-weight: 800;
  line-height: 1.2;
}

.card-info span {
  font-size: 0.82rem;
  color: var(--text-light);
}

.form-card {
  background: var(--bg-card);
  border-radius: var(--radius);
  padding: 1.5rem;
  box-shadow: var(--shadow);
  max-width: 600px;
  margin-bottom: 2rem;
}

table {
  width: 100%;
  background: var(--bg-card);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  border-collapse: collapse;
}

thead {
  background: linear-gradient(135deg, #2c1810, #4a2c1a);
}

th {
  padding: 0.9rem 1rem;
  text-align: right;
  font-weight: 600;
  color: #fff;
  font-size: 0.85rem;
  letter-spacing: 0.3px;
}

td {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid #f0ebe4;
  color: var(--text);
}

tr:last-child td {
  border-bottom: none;
}

tbody tr {
  transition: background 0.2s ease;
}

tbody tr:hover {
  background: rgba(199,62,29,0.04);
}

tr.low-stock {
  background: #fff8e1;
}

tr.low-stock:hover {
  background: #fff3cd;
}

.badge {
  background: linear-gradient(135deg, #dc3545, #c82333);
  color: #fff;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.7rem;
  margin-right: 0.5rem;
  font-weight: 600;
  display: inline-block;
}

.btn {
  background: var(--gradient);
  color: #fff;
  border: none;
  padding: 0.55rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Cairo', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.btn:hover {
  background: var(--gradient-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(199,62,29,0.3);
}

.btn:active {
  transform: translateY(0);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn.small {
  padding: 0.3rem 0.8rem;
  font-size: 0.78rem;
  border-radius: 6px;
}

.btn.danger {
  background: linear-gradient(135deg, #dc3545, #c82333);
}

.btn.danger:hover {
  background: linear-gradient(135deg, #c82333, #a71d2a);
  box-shadow: 0 4px 12px rgba(220,53,69,0.3);
}

.btn.outline {
  background: transparent;
  border: 2px solid var(--primary);
  color: var(--primary);
}

.btn.outline:hover {
  background: var(--primary);
  color: #fff;
}

.actions {
  display: flex;
  gap: 0.4rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-header h2 {
  margin-bottom: 0;
}

.qty-input {
  width: 70px;
  padding: 0.35rem 0.5rem;
  border: 2px solid #e0d6cc;
  border-radius: 6px;
  text-align: center;
  font-family: 'Cairo', sans-serif;
  font-size: 0.85rem;
  transition: border-color 0.2s;
  background: #fdfaf7;
}

.qty-input:focus {
  outline: none;
  border-color: var(--primary);
}

.add-stock {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(44, 24, 16, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 2rem;
  min-width: 420px;
  max-width: 90vw;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  animation: modalIn 0.3s ease;
}

@keyframes modalIn {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.modal h3 {
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  color: var(--text);
  font-weight: 800;
}

.modal label {
  display: block;
  margin-bottom: 1rem;
  font-weight: 600;
  color: var(--text);
  font-size: 0.9rem;
}

.modal label input,
.modal label select {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 2px solid #e0d6cc;
  border-radius: 8px;
  margin-top: 0.3rem;
  font-family: 'Cairo', sans-serif;
  font-size: 0.9rem;
  transition: border-color 0.2s;
  background: #fdfaf7;
}

.modal label input:focus,
.modal label select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(199,62,29,0.1);
}

.form-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

form input,
form select {
  padding: 0.55rem 0.8rem;
  border: 2px solid #e0d6cc;
  border-radius: 8px;
  font-family: 'Cairo', sans-serif;
  font-size: 0.9rem;
  transition: border-color 0.2s;
  background: #fdfaf7;
}

form input:focus,
form select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(199,62,29,0.1);
}

form select {
  min-width: 200px;
}

.section {
  background: var(--bg-card);
  border-radius: var(--radius);
  padding: 1.5rem;
  box-shadow: var(--shadow);
}

.section h3 {
  margin-bottom: 1rem;
}

/* Page transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Modal transitions */
.modal-enter-active {
  animation: modalIn 0.3s ease;
}

.modal-leave-active {
  animation: modalIn 0.3s ease reverse;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg);
}

::-webkit-scrollbar-thumb {
  background: #d4c9bc;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #bfb0a0;
}
</style>
