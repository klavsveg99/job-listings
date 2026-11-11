# Job Application Tracker

A personal job application tracker built with React, TypeScript and Supabase. Sign in, add the roles you have applied for, move them through your pipeline and keep links and notes in one place.

**Live demo:** https://job-listings-rose-eight.vercel.app/

## Features

- Email and password authentication with Supabase Auth
- Email confirmation for new accounts
- Duplicate email check before sign up
- Create, edit and delete job applications
- Five pipeline statuses: Saved, Applied, Interview stage, Rejected and Offer
- Filter the board by one or more statuses
- Job posting URL and free-form notes
- Per-user data isolated with Supabase Row Level Security
- Live updates through Supabase Realtime
- Light and dark theme, following the system preference by default
- Responsive layout

## Tech stack

- React 19
- TypeScript
- Vite
- Supabase (Auth, Postgres, Row Level Security, Realtime)
- CSS

## Getting started

Requirements: Node.js 18 or newer, npm and a Supabase project.

```bash
git clone https://github.com/klavsveg99/job-listings.git
cd job-listings
npm install
cp .env.example .env.local
```

Set the values in `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_APP_TITLE=job-listings
```

Find both values in Supabase under **Project Settings → API**. The anon key is safe to use in the browser because Row Level Security controls access to the data.

Start the development server:

```bash
npm run dev
```

Open http://localhost:5173.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run the schema and function below.
3. Make sure Email is enabled under **Authentication → Providers**.
4. Optionally enable Realtime for the `jobs` table under **Database → Replication** to get live updates across tabs and devices.
5. Put the project URL and anon key into `.env.local`.

### Database schema

```sql
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  status text not null default 'saved',
  url text,
  notes text,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists jobs_user_id_idx on public.jobs (user_id);

alter table public.jobs enable row level security;

create policy "Users can view own jobs"
  on public.jobs for select
  using (auth.uid() = user_id);

create policy "Users can insert own jobs"
  on public.jobs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own jobs"
  on public.jobs for update
  using (auth.uid() = user_id);

create policy "Users can delete own jobs"
  on public.jobs for delete
  using (auth.uid() = user_id);
```

### Duplicate email check

The sign-up form calls `check_user_exists` before creating an account so it can show a clear message instead of a raw Supabase error. Run this once:

```sql
create or replace function public.check_user_exists(email_to_check text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  return exists (
    select 1
    from auth.users
    where lower(email) = lower(email_to_check)
  );
end;
$$;

revoke all on function public.check_user_exists(text) from public;
grant execute on function public.check_user_exists(text) to anon, authenticated;
```

This function lets anonymous clients check whether an email is registered. That is required for the duplicate-email message, but it is an email enumeration trade-off. Remove the check if that matters for your deployment.

## How it works

`AuthContext` keeps the Supabase session and exposes sign up, sign in and sign out. `JobBoard` loads only the signed-in user's rows and subscribes to Postgres changes for that user. Row Level Security enforces the same rule in the database, so another account cannot read or change the data even if it bypasses the UI.

The theme is stored in `localStorage`, with the operating system preference as the initial value.

## Project structure

```
src/
├── components/
│   ├── AddJobForm.tsx
│   ├── Auth.tsx
│   ├── Header.tsx
│   ├── JobBoard.tsx
│   ├── JobCard.tsx
│   └── ThemeToggle.tsx
├── contexts/
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── supabaseClient.ts
├── App.tsx
├── App.css
├── index.css
└── main.tsx
```

## Notes and limitations

- This is a single-user tracker: every account sees only its own rows.
- New accounts go through email confirmation. If you disable confirmation for local testing, use the sign-in form after signing up.
- There is no password reset or account deletion flow yet.
- Keep `.env.local` out of version control. Only the placeholder values belong in `.env.example`.

## Possible next steps

- Add password reset and account deletion
- Add deadlines and reminder notifications
- Export applications to CSV or PDF
- Add a statistics dashboard with response and interview rates
- Add search, sorting and custom statuses
- Add end-to-end tests for authentication and job CRUD
