# La Parole Shop - Nest.js & Prisma Application

Полноценное руководство по запуску и настройке проекта.  
**Версия:** 1.0.0  
**Технологии:** Nest.js 9+, Prisma 5+, PostgreSQL 15+, Docker 24+

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io/)

## Содержание
1. [Требования](#-требования)
2. [Быстрый старт](#-быстрый-старт)
3. [Конфигурация](#-конфигурация)
4. [Работа с БД](#-работа-с-бд)
5. [Docker-развертывание](#-docker-развертывание)
6. [Тестирование](#-тестирование)

---

## ⚙️ Требования

- Node.js v18.16.0+
- pnpm 8.6.0+
- Docker Engine 24.0+ 
- Docker Compose 2.20+
- PostgreSQL 15.4+

---

## 🚀 Быстрый старт

### Локальная установка
```bash
# 1. Клонировать репозиторий
git clone https://github.com/mazay33/la-parole-shop.git
cd la-parole-shop

# 2. Установить зависимости
pnpm install #npm install -g pnpm (if no pnpm)

# 3. Инициализировать окружение
cp .env.example .env
nano .env  # Редактировать параметры

# 4. Запустить БД и приложение
docker-compose up -d postgres  # Только PostgreSQL
npx prisma generate
pnpm prisma migrate dev --name init
pnpm start:dev
```

Production-сборка
```bash
pnpm build
pnpm start:migrate:prod
```

## 🔧 Конфигурация

Основные переменные (.env)

```
PORT=3000
DB_NAME=la-parole-shop
DB_HOST=localhost # postgres (if you use docker)
DB_USER=postgres
DB_PASSWORD=your_db_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret
JWT_EXP=1d
SMTP_HOST="your_smtp_host"
SMTP_PORT=your_smtp_port
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_email_password
API_URL=http://localhost:3000
CLIENT_URL=http://localhost:4000

GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

YANDEX_APP_ID="your_yandex_app_id"
YANDEX_APP_SECRET="your_yandex_app_secret"

DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public"

NODE_ENV=dev

```

## 🗃️ Работа с БД

```bash
# Создать новую миграцию
pnpm prisma migrate dev --name add_user_table

# Применить миграции в production
pnpm prisma migrate deploy

# Генерация клиента Prisma
pnpm prisma generate
```

### 🐳 Docker-развертывание
```bash
# Запуск в фоне
docker-compose up -d --build

# Просмотр логов
docker-compose logs -f app

# Остановка
docker-compose down -v
```


### 🧪 Тестирование

```bash
# Unit-тесты
pnpm test

# Запуск линтеров
pnpm lint
```
