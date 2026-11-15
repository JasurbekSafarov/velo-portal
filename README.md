# Velo Portal

Cycling federation portal: news, competition calendar, results. Node.js + Express + MongoDB, KZ/RU content.

## Run
1. `npm install`
2. Copy `.env.example` to `.env` and fill it in
3. `npm run seed` (creates admin + sample data)
4. `npm run dev` -> http://localhost:5000

## API
| Method | Path | Auth |
|---|---|---|
| POST | /api/auth/login | no |
| GET | /api/news, /api/news/:id | no |
| GET | /api/competitions?discipline=road\|track\|mtb\|bmx | no |
| GET | /api/results?competition=ID&category=Elite | no |
| POST / PUT / DELETE | /api/news, /api/competitions, /api/results | Bearer token |
