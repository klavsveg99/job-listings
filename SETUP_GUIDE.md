# Job Listing Board - Setup Guide

## Current Status ✅
Your React + Supabase job listing board is ready! The app is running at `http://localhost:5174/`

## Database Setup Required

You need to set up the database tables in your Supabase project. Here's how:

### Step 1: Go to Supabase Console
1. Visit https://app.supabase.com/
2. Log in with your account
3. Select your project (nwomyemjcvfwsddnxvvx)

### Step 2: Run the SQL Setup
1. Go to **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy and paste the contents of `DATABASE_SETUP.sql` in this folder
4. Click **Run** button

This will create:
- `jobs` table with columns: id, user_id, title, company, status, url, notes, created_at, updated_at
- Row Level Security (RLS) policies so users can only access their own jobs

## Features

### Authentication
- Sign up with email and password
- Login/logout functionality
- Session persistence

### Job Management
- **Add Jobs**: Click "+ Add New Job" button to create a new job listing
- **Job Information**:
  - Job Title (required)
  - Company (required)
  - Job Status (dropdown)
  - Job URL (optional)
  - Notes (optional)

### Job Status Options
- **Saved**: Initial status for jobs you're interested in
- **Applied**: You've submitted an application
- **Interview Stage**: You're in the interview process
- **Rejected**: Application was rejected
- **Offer**: You received a job offer

### Actions
- **Update Status**: Click on the colored status badge to change it
- **Delete Job**: Click the X button on any job card to remove it
- **View Job**: Click the "View Job Posting →" link to open the original job listing

## Project Structure

```
src/
├── components/
│   ├── Auth.tsx & Auth.css              # Login/signup form
│   ├── Header.tsx & Header.css          # Top navigation with user info
│   ├── JobBoard.tsx & JobBoard.css      # Main job listing display
│   ├── AddJobForm.tsx & AddJobForm.css  # Form to add new jobs
│   └── JobCard.tsx & JobCard.css        # Individual job card component
├── contexts/
│   └── AuthContext.tsx                  # Authentication state management
├── supabaseClient.ts                    # Supabase client configuration
├── App.tsx                              # Main app component
├── main.tsx                             # Entry point
├── index.css                            # Global styles
└── App.css                              # Root styles
```

## Database Schema

```sql
jobs (
  id: UUID (primary key)
  user_id: UUID (references auth.users)
  title: TEXT (required)
  company: TEXT (required)
  status: TEXT (default: 'saved')
  url: TEXT (optional)
  notes: TEXT (optional)
  created_at: TIMESTAMP
  updated_at: TIMESTAMP
)
```

## Row Level Security (RLS)

All data is protected by RLS policies:
- ✅ Users can only view their own jobs
- ✅ Users can only insert jobs associated with their account
- ✅ Users can only update/delete their own jobs

## Running the App

The development server is running at `http://localhost:5174/`

To stop the server, press `Ctrl+C` in the terminal.

To rebuild:
```bash
npm run build
```

## Troubleshooting

### "Auth failed" or "User not authenticated"
- Make sure you've successfully signed up/logged in
- Check that Supabase authentication is enabled in your project

### Jobs not showing up
- Verify the database table was created properly
- Check that you're logged in
- Make sure Row Level Security policies are enabled

### Jobs disappearing after refresh
- This is normal during development - clear your browser cache
- In production, jobs persist in the database

## Next Steps (Optional Enhancements)

You could add:
- Email notifications for job applications
- Job search/filter functionality
- Export jobs to CSV
- Interview reminders
- Salary tracking
- Multiple job board templates
- Company ratings/reviews
