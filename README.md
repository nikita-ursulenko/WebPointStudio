# 🚀 WebPoint Studio

<div align="center">
  <div style="display:flex; justify-content:center; gap:5px; flex-wrap:wrap; margin: 10px 0;">
    <a href="https://angular.io/"><img src="https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular"></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"></a>
    <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"></a>
    <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"></a>
    <a href="https://www.sqlite.org/"><img src="https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite"></a>
  </div>
</div>

**WebPoint** — это современная студия веб-разработки, создающая премиальные сайты, лендинги и интернет-магазины. Мы объединяем стильный дизайн, передовые технологии и высокую производительность.

![WebPoint Banner](/public/og-image.jpg)

## 🌐 О Проекте

Этот репозиторий содержит исходный код официального сайта WebPoint Studio. Проект разработан как Single Page Application (SPA) с использованием современных веб-технологий.

**URL:** [https://webpoint-visionary-sites.vercel.app/](https://webpoint-visionary-sites.vercel.app/)

### Ключевые Особенности
- **⚡️ Vite + React:** Молниеносная производительность и современная разработка.
- **🎨 Tailwind CSS + Shadcn UI:** Премиальный, адаптивный дизайн с анимациями.
- **🌑 Dark Mode:** Полная поддержка темной темы.
- **🌍 Мультиязычность:** Поддержка RU, RO, EN.
- **🔥 Supabase:** База данных (PostgreSQL), Аутентификация и Edge Functions.
- **📧 Resend:** Система email-уведомлений для контактов и заявок.

---

## 🛠 Технологический Стек

- **Frontend:** React, TypeScript, Vite
- **UI Framework:** Tailwind CSS, Shadcn UI, Framer Motion
- **Backend / DB:** Supabase (PostgreSQL, Auth, Storage)
- **Functions:** Supabase Edge Functions (Deno)
- **Email:** Resend API
- **AI Integration:** Groq API (для генерации контента)
- **Deployment:** Vercel

---

## 🚀 Запуск Локально

1. **Клонируйте репозиторий:**
   ```bash
   git clone https://github.com/nikita-ursulenko/webpoint-visionary-sites.git
   cd webpoint-visionary-sites
   ```

2. **Установите зависимости:**
   ```bash
   npm install
   ```

3. **Настройте переменные окружения:**
   Создайте файл `.env` в корне проекта и добавьте ключи (см. `.env.example` или запросите у администратора):
   ```env
   VITE_SUPABASE_URL=YOUR_SUPABASE_URL
   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_KEY
   ...
   ```

4. **Запустите сервер разработки:**
   ```bash
   npm run dev
   ```

---

## 📦 Деплой

Проект настроен для автоматического деплоя на **Vercel**.

1. Любой push в ветку `main` автоматически запускает сборку и деплой.
2. Конфигурация деплоя находится в `vercel.json` (включая SPA роутинг и заголовки безопасности).

---

## 📞 Контакты

- **Email:** info@webpoint.md
- **Телефон:** +373 60 123 456
- **Адрес:** Кишинёв, ул. Пушкина 22

---

© 2026 WebPoint Studio. All rights reserved.
