
# NYC Theatre — Broadway & Off-Broadway (Mobile-first)

A production-ready starter you can run **today**. Includes:
- Next.js 14 (App Router) + TypeScript
- Prisma ORM + SQLite (easy to switch to Postgres)
- Tailwind (mobile-first)
- Show list with **search**, **Broadway/Off-Broadway toggle**, **category chips**
- Show detail with **summary**, **venue**, **buy links**, and **saving tips**

> Seed data is sample/demonstrative. Replace with your own or extend `prisma/seed.ts` with real sources.

## Quick start

1) **Setup env**
```
cp .env.example .env
```

2) **Install deps**
```
npm install
```

3) **Init DB & seed**
```
npx prisma migrate dev --name init
npx prisma db seed
```

4) **Run**
```
npm run dev
```

Open http://localhost:3000

## Deploy

- Push this repo to GitHub
- Deploy to **Vercel**
- Set `DATABASE_URL` to a hosted Postgres (Neon/Supabase) or keep SQLite (Vercel supports file-based with some caveats).
- Run Prisma migrations in a deploy hook.

## Switching to Postgres

1. Create a Postgres DB (Neon/Supabase).
2. Set `DATABASE_URL="postgresql://..."` in `.env`.
3. Run:
```
npx prisma migrate deploy
```

## Data model
See `prisma/schema.prisma` (Shows, Venues, Categories, TicketLinks, SavingTips, Sources).

## API
- `GET /api/shows?type=BROADWAY&categories=Musical,Comedy&q=wicked`
- `GET /api/categories`

## Notes on ticket prices & scraping
Many providers restrict scraping. V1 links to official box offices and reputable vendors and surfaces **money-saving tips**. For live pricing, pursue partner APIs (TodayTix, Ticketmaster/Telecharge) and store **price snapshots** in a new `price_snapshots` table.

## Roadmap ideas
- Admin CMS at `/admin` (NextAuth-protected) to edit shows and tips
- Algolia/Meilisearch for typo-tolerant instant search
- PWA offline caching
- JSON-LD for SEO
- Cron revalidation of Sources

— Generated 2025-08-14
