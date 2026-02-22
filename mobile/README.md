# Mobile (React Native + Expo)

## Setup

```bash
cd mobile
npm install
npx expo start
```

Use `EXPO_PUBLIC_API_URL` to point to backend API:

```bash
EXPO_PUBLIC_API_URL=http://localhost:3000 npm run start
```

## Implemented scaffold
- Navigation with 5 core screens
- Areas list
- Process tree screen with search + breadcrumbs + expand/collapse
- Process detail screen with linked tools/people/documents
- Typed services/hooks for backend integration
