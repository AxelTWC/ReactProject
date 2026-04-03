# AI Interaction Record

This file documents representative AI-assisted sessions that meaningfully influenced FitTrack.

## Session 1: Diagnosing CSV Import Transaction Timeout

### Prompt (you sent to AI)

"CSV upload is failing on Azure/PostgreSQL with transaction timeout errors (P2028). How should we change import logic so larger files succeed?"

### AI Response (trimmed)

AI suggested reducing per-row database operations by batching writes:

- Create session records once per unique date.
- Upsert exercises once per unique exercise name.
- Insert workout sets using `createMany` in one transaction.
- Increase transaction timeout settings for remote DB latency.

### What Your Team Did With It

- Useful: The batching approach was applied and significantly reduced transaction overhead.
- Incorrect/incomplete: Initial suggestion did not fully match our existing schema relationships and required adaptation.
- Verification: We implemented schema-compatible batching, re-ran CSV uploads (including larger files), and confirmed successful imports with valid/invalid row reporting.

## Session 2: Auth Migration to Better Auth + Google OAuth

### Prompt (you sent to AI)

"Help us replace custom JWT login with Better Auth and Google OAuth while keeping protected routes and user mapping intact."

### AI Response (trimmed)

AI proposed integrating Better Auth with Prisma adapter, wiring auth route handlers, and replacing custom JWT checks with session-based checks.

### What Your Team Did With It

- Useful: Migration checklist and integration points accelerated implementation.
- Incorrect/incomplete: Some suggested code paths needed adjustment for our route structure and middleware usage.
- Verification: We tested email/password login, Google OAuth, protected route redirection, and authenticated API access.

## Session 3: Dashboard/Data Consistency and Cache Behavior

### Prompt (you sent to AI)

"After logout and navigation, stale dashboard data sometimes appears. Also chart scaling overflows for larger values."

### AI Response (trimmed)

AI suggested adding cache-control headers for protected routes and replacing hardcoded chart max values with dynamic calculations from returned data.

### What Your Team Did With It

- Useful: Dynamic scaling and cache-control strategy resolved observed behavior.
- Incorrect/incomplete: Suggested changes were too broad initially; we narrowed updates to protected routes and analytics responses.
- Verification: Manual flows were tested (login -> dashboard -> logout -> back navigation), and chart rendering was checked across varied data ranges.

---

## Validation Approach Used Across Sessions

1. Build verification (`npm run build`).
2. Manual end-to-end user flow testing.
3. API response checks for expected status/data shape.
4. Schema-aligned implementation review before merging AI-suggested changes.
