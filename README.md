# Process Mapping Case

Monorepo com:
- `backend/` (Fastify + Prisma + MySQL)
- `mobile/` (Expo + React Native)

## Documentação
- visão técnica completa: `CODEX.md`
- backend (setup/rotas): `backend/README.md`
- mobile (setup): `mobile/README.md`

## Quickstart
No diretório raiz:

```bash
docker compose up -d
cd mobile && npm run start
```

Serviços:
- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/docs`
- MySQL: `localhost:3306` (`app` / `app`, db `process_map`)
