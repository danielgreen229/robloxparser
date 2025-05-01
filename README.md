# Roblox Parser

Парсер статистики игр Roblox

## 🎥 Демонстрация



https://github.com/user-attachments/assets/e60b4abb-547d-42e9-bb7f-b67f9fd5172b



## ✨ Особенности

- 📡 Парсинг данных игр Roblox через API
- 📊 Отображение статистики в удобной таблице
- 🔗 Обработка множества URL одновременно
- 💾 Сохранение истории запросов
- 🐳 Docker-контейнеризация для простого развертывания

## 🏗 Структура проекта

```
robloxparser/
├── backend/                  # NestJS сервер
│   ├── src/                 # Исходный код
│   │   ├── common/          # Общие утилиты
│   │   ├── roblox/          # Модуль работы с Roblox API
│   │   │   ├── *.controller.ts   # Контроллеры
│   │   │   ├── *.service.ts      # Логика
│   │   │   ├── *.service.spec.ts # Тесты
│   │   │   └── *.module.ts       # Модули
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── interfaces/      # Интерфейсы
│   │   ├── app.module.ts    # Главный модуль
│   │   └── main.ts          # Точка входа
│   ├── Dockerfile           # Конфигурация Docker
│   └── package.json         # Зависимости
│
└── frontend/                # Vue 3 клиент
    ├── src/
    │   ├── assets/          # Статические ресурсы
    │   ├── components/      # UI компоненты
    │   ├── composables/     # Тех ui
    │   ├── stores/          # Pinia хранилища
    │   ├── styles/          # SCSS стили
    │   ├── views/           # Страницы
    │   └── main.ts          # Точка входа
    ├── public/              # Публичные файлы
    ├── vue.config.js        # Конфиг Vite
    └── package.json         # Зависимости
```

## 🚀 Быстрый старт

### С Docker (рекомендуется)

```bash
git clone https://github.com/your-username/robloxparser.git
cd robloxparser
docker-compose up --build
```

Приложение будет доступно:
- Frontend: [http://localhost:8080](http://localhost:8080)
- API: [http://localhost:3000](http://localhost:3000)

### Без Docker

**Backend:**
```bash
cd backend
npm install
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 📡 API Endpoints

- `POST /games/info` - Получение информации об играх
  ```json
  {
    "games": [
      {"url": "https://www.roblox.com/games/1818/Classic-Crossroads"}
    ]
  }
  ```

## 🛠 Технологии

| Часть       | Технологии                          |
|-------------|-------------------------------------|
| **Frontend** | Vue 3, Pinia, SCSS                 |
| **Backend**  | NestJS, TypeScript                 |
| **Infra**    | Docker, Docker Compose             |

## 🤝 Участие в разработке

1. Форкните репозиторий
2. Создайте feature-ветку (`git checkout -b feature/AmazingFeature`)
3. Сделайте коммит (`git commit -m 'Add some feature'`)
4. Запушьте ветку (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## 📜 Лицензия

MIT © [Ваше Имя](https://github.com/danielgreen229)

---

⭐ Если проект вам понравился, не забудьте поставить звезду!
