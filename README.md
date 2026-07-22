# Sushi Rolly

Клиентское приложение сервиса быстрого питания: меню, корзина, заказ с самовывозом/доставкой и история заказов.

Стек: **Nuxt 4**, **Nuxt UI**, **PostgreSQL**, **Drizzle ORM**, **FSD**.

## Стек бэкенда

| Инструмент | Назначение |
|---|---|
| **PostgreSQL** | Основная база данных |
| **Docker Compose** | Локальный PostgreSQL для разработки |
| **Drizzle ORM** | Схема БД и запросы |
| **postgres.js** | Драйвер PostgreSQL для Node |
| **drizzle-kit** | Миграции и push схемы |
| **Nitro (server/)** | REST API внутри Nuxt |

## Быстрый старт

```bash
# 1. Зависимости
npm install

# 2. Переменные окружения
cp .env.example .env

# 3. PostgreSQL (Docker)
npm run db:up

# 4. Схема и данные меню
npm run db:push
npm run db:seed

# 5. Запуск
npm run dev
```

Приложение: [http://localhost:3000](http://localhost:3000)

## API

| Метод | Путь | Описание |
|---|---|---|
| POST | `/api/auth/request-code` | Запрос SMS-кода |
| POST | `/api/auth/verify-code` | Вход по коду |
| POST | `/api/auth/logout` | Выход |
| GET | `/api/auth/me` | Текущий пользователь |
| GET | `/api/menu` | Меню из БД |
| GET | `/api/orders` | Заказы пользователя |
| POST | `/api/orders` | Создание заказа |

Авторизация через httpOnly cookie `sushi_session`. Демо-код: `1234`.

## Структура (FSD)

```
src/
  pages/          # маршруты
  widgets/        # header, menu-catalog, cart-panel, orders-list
  features/       # auth-by-phone, add-to-cart, checkout
  entities/       # user, menu, cart, order
  shared/         # config, lib, api
server/
  api/            # REST endpoints
  database/       # schema, migrations, seed
  utils/          # auth, session
```

Корзина хранится в `localStorage`, пользователь и заказы — в PostgreSQL.
