# Techno-Strelka-2025

## Установка

1. Клонируйте репозиторий:

```bash
По https:
git clone https://github.com/Shogun-Sun/Techno-Strelka-2025.git 

По ssh:
git clone git@github.com:Shogun-Sun/Techno-Strelka-2025.git
```
2. Перейдите в репозиторий:
```bash
cd Techno-Strelka-2025/
```
3. Установите зависимости:
```bash
npm install
```
4. Создайте файл .env и настройте переменные окружения:
```bash
#Пример .env файла:
PROJECT_STATUS=dev
PORT=3000
```
5. При необходимости измените файл config.ts

## Запуск проекта
Для запуска проекта в режиме разработки:
```bash
npm run start:dev
``` 

Для запуска проекта в режиме продакшн:
```bash
npm run start:prod
```

Для простого запуска:
```bash
npm run start
```

## Структура проекта
```bash
Techno-Strelka-2025/
├── public/                  # Статические файлы
│   ├── css/
│   ├── js/
│   └── pictures/
├── src/                     # Исходный код приложения
│   ├── chat-bot/            # Модуль чат-бота
│   ├── chips/               # Модуль фишек
│   ├── config.ts            # Конфигурация приложения
│   ├── database/            # Модуль для работы с базой данных
│   ├── decorators/          # Декораторы
│   ├── main.ts              # Точка входа в приложение
│   ├── pages/               # Модуль для страниц
│   ├── reviews/             # Модуль отзывов
│   ├── session/             # Модуль сессий
│   ├── t2api/               # Модуль для работы с API Т2
│   └── user/                # Модуль пользователей
├── test/                    # Тесты
├── .env                     # Переменные окружения
├── package.json             # Зависимости и скрипты
├── tsconfig.json            # Конфигурация TypeScript
└── README.md                # Документация
```
