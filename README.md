# ithub-shoes

На основе исходного кода, размещенного по ссылке, либо выбранного вами стека технологий, выполните следующие задания

1. Спроектировать, создать и наполнить базу данных (sqlite, postgres, mysql) на основании табличных данных из файла `shoes_data.xlsx`. Реализуйте таблицы `brands`, `products`, `categories`, `gender`, `sizes`, `colors` и связи между ними. (3 балла)

2. Описать контракты (если ваш стек предполагает contract-first разработку) и имплементировать соответствующие методы для ресурсов `brands`, `products`, `categories`, `colors`, `sizes`. Должны быть реализованы методы для получения всех записей (в базовом варианте), отдельных записей (по id), создания новых записей, удаления и обновления записей. (5 баллов)

3. Опишите схемы входных и выходных данных через Zod, Valibot, Yup, Typebox, Arktype или аналоги. (3 баллов)

3. Метод для получения всех записей ресурса `products` должен поддерживать пагинацию, сортировку, фильтрацию, а также возможность указания массива интересующих полей.

- пагинация настраивается через query-параметры `limit` и `offset`, где `limit` ограничен фиксированными значениями 10, 20, 50; (1 балла)

- сортировка настраивается через query-параметры в bracket-нотации `?sort[0]=fieldName.asc&sort[1]=fieldName.desc`; (3 балла)

- фильтрация настраивается через query-параметры в bracket-нотации `?filter[0]=fieldName[operator]value&filter[1]=fieldName[operator]value`; (3 балла)

- выбор полей настраивается через query-параметр в виде `?select=brand,title,createdAt` (2 балла)

4. Необходимо сгенерировать OpenAPI-совместимую спецификацию и, в идеале, сделать ее доступной по выделенному пути. (3 балла)

--- 
This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines React, TanStack Router, Fastify, ORPC, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **TanStack Router** - File-based routing with full type safety
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components
- **Fastify** - Fast, low-overhead web framework
- **oRPC** - End-to-end type-safe APIs with OpenAPI integration
- **Node.js** - Runtime environment
- **Prisma** - TypeScript-first ORM
- **SQLite/Turso** - Database engine
- **Authentication** - Better-Auth

## Getting Started

First, install the dependencies:

```bash
pnpm install
```
## Database Setup

This project uses SQLite with Prisma.

1. Start the local SQLite database:
```bash
cd apps/server && pnpm db:local
```


2. Update your `.env` file in the `apps/server` directory with the appropriate connection details if needed.

3. Generate the Prisma client and push the schema:
```bash
pnpm db:push
```


Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.
The API is running at [http://localhost:3000](http://localhost:3000).


## Project Structure

```
ithub-shoes/
├── apps/
│   ├── web/         # Frontend application (React + TanStack Router)
│   └── server/      # Backend API (Fastify, ORPC)
├── packages/
│   ├── api/         # API layer / business logic
│   ├── auth/        # Authentication configuration & logic
│   └── db/          # Database schema & queries
```

## Available Scripts

- `pnpm dev`: Start all applications in development mode
- `pnpm build`: Build all applications
- `pnpm dev:web`: Start only the web application
- `pnpm dev:server`: Start only the server
- `pnpm check-types`: Check TypeScript types across all apps
- `pnpm db:push`: Push schema changes to database
- `pnpm db:studio`: Open database studio UI
