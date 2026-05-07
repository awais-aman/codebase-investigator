# Codebase Investigator

Paste a public GitHub URL, ask questions about the code in plain English, and
get answers grounded in specific files and line ranges. Every non-trivial answer
ships with an independent audit verdict.

## Layout

```
codebase-investigator/
├── investigator-be/   NestJS API — agent loop, tools, audit pipeline
├── investigator-fe/   Next.js App Router — chat UI
└── README.md
```

The two apps are independent. They live in one git repo for convenience but
deploy separately:

- **Frontend** → Vercel (set Root Directory to `investigator-fe`)
- **Backend** → Railway (set Root Directory to `investigator-be`)

## Local setup

### 1. Backend

```bash
cd investigator-be
cp .env.example .env       # then fill in DATABASE_URL, DIRECT_URL, ANTHROPIC_API_KEY
npm install
npm run prisma:generate
npm run prisma:migrate     # first time only — creates tables in Supabase
npm run start:dev          # http://localhost:4000/api
```

Swagger UI: http://localhost:4000/api/docs

### 2. Frontend

```bash
cd investigator-fe
cp .env.example .env.local
npm install
npm run dev                # http://localhost:3000
```

## How the audit works

Every assistant answer is verified by **two independent checks** — neither runs
in the same prompt as the answer itself:

1. **Programmatic citation check** — for each `(file, lineStart, lineEnd)` cited
   in the answer, verify the file exists, the range is valid, and the cited
   excerpt actually matches the source.
2. **Independent LLM audit** — a second Claude call with no tools, given the
   user question, the answer, and the cited file contents. It returns a verdict
   (`trusted | partial | suspect`) and reasons. It is prompted to be skeptical
   and look for hallucinated citations, claims unsupported by the cited code,
   and suggested fixes that would break other code.

The UI shows the verdict as a badge next to each answer. Click to see the
reasons.

## Stack

- **Backend**: NestJS 11, Prisma 6, Supabase (Postgres), `@anthropic-ai/sdk`,
  `simple-git`, `ripgrep` (system binary)
- **Frontend**: Next.js 16 (App Router), React 19, TanStack Query 5, Tailwind 4,
  shadcn-style components

## Status

Scaffolding stage — apps boot, schema is defined, modules are next.
