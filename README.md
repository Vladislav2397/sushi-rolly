# Sushi Rolly

Клиентское приложение сервиса быстрого питания: меню сетов, корзина, заказ с самовывозом/доставкой и история заказов.

Стек: **Nuxt 4**, **Nuxt UI**, **FSD**.

## Запуск

```bash
npm install
npm run dev
```

Приложение: [http://localhost:3000](http://localhost:3000)

## Функционал

- Авторизация по телефону (демо-код `1234`)
- Меню из 6 сетов (№1–№6)
- Суши, роллы и напитки поштучно
- Корзина
- Оформление: самовывоз или доставка
- Список своих заказов

Данные пользователя, корзины и заказов хранятся в `localStorage` (без бэкенда).

## Структура (FSD)

```
app/
  pages/          # слой pages (маршруты Nuxt)
  widgets/        # header, menu-catalog, cart-panel, orders-list
  features/       # auth-by-phone, add-to-cart, checkout
  entities/       # user, menu, cart, order
  shared/         # config, lib
  layouts/
```
