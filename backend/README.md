# Backend (Fastify + Prisma)

## Setup

```bash
cd backend
npm install
cp .env.example .env
# fill DATABASE_URL
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## Docker
- Root compose file runs `mysql` + `backend` together.
- From project root:

```bash
docker compose up --build mysql backend
```

## API
- Base URL: `http://localhost:3000`
- Swagger: `http://localhost:3000/docs`
- Health: `GET /health`

## Core routes
- `GET /areas`
- `POST /areas`
- `GET /areas/:id`
- `PUT /areas/:id`
- `DELETE /areas/:id`
- `GET /areas/:areaId/processes/tree`
- `POST /areas/:areaId/processes`
- `GET /processes/:id`
- `PUT /processes/:id`
- `DELETE /processes/:id`
- `POST /processes/:id/tools`
- `DELETE /processes/:id/tools/:toolId`
- `POST /processes/:id/people`
- `DELETE /processes/:id/people/:personId`
- `POST /processes/:id/documents`
- `DELETE /processes/:id/documents/:documentId`
