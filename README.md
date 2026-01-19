# Job Application Tracker

A personal job application tracker built with React, TypeScript, and Supabase. This project demonstrates my skills as a junior React developer and showcases best practices in authentication, state management, and real-time data synchronization.

## Live Preview

https://job-listings-rose-eight.vercel.app/

## Features

- User authentication (Sign Up/Sign In)
- Track job applications with status updates
- Add job details, notes, and application links
- Email confirmation for new accounts
- Responsive design
- Loading states and error handling
- Full TypeScript implementation

## Tech Stack

- React 19
- TypeScript
- Vite
- Supabase
- CSS3
- ESLint

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── JobBoard.tsx    # Main job management interface
│   ├── JobCard.tsx     # Individual job application card
│   ├── AddJobForm.tsx  # Form for adding/editing jobs
│   ├── Auth.tsx        # Authentication component
│   └── Header.tsx      # Application header
├── contexts/           # React contexts for state management
│   └── AuthContext.tsx # Authentication context
├── supabaseClient.ts   # Supabase client configuration
├── App.tsx            # Main application component
└── main.tsx           # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd job-listings
```

2. Install dependencies:
```bash
npm install
```

### Supabase Initial Setup

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with your GitHub account
4. Create a new project
5. Wait for the project to be ready (2-3 minutes)

#### Initial Database Setup

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy and paste this SQL to create the jobs table:

```sql
-- Create jobs table for tracking personal job applications
CREATE TABLE IF NOT EXISTS jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'saved',
    url TEXT,
    notes TEXT,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Create policies for user data privacy
CREATE POLICY "Users can view own jobs" ON jobs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own jobs" ON jobs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own jobs" ON jobs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own jobs" ON jobs FOR DELETE USING (auth.uid() = user_id);
```

4. Click **Run** to execute the SQL

#### Duplicate Email Prevention Setup

To prevent duplicate email registrations, create this additional function:

```sql
-- Create a public function to check if user exists
-- This allows checking without requiring admin access
CREATE OR REPLACE FUNCTION check_user_exists(email_to_check TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO user_count
    FROM auth.users
    WHERE LOWER(email) = LOWER(email_to_check);
    
    RETURN user_count > 0;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION check_user_exists(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION check_user_exists(TEXT) TO anon;
```

5. Click **Run** again to execute the duplicate email prevention function

#### Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings → API**
2. Copy the **Project URL** and **anon public** key

#### Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` and replace with your actual Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_APP_TITLE=job-listings
```

### Start the Development Server

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Future Enhancements

- Search and filter functionality for job applications
- Export job applications to PDF/CSV
- Application deadlines and reminder notifications
- Statistics dashboard with application success rate
- Custom status options and priority levels
- Better mobile responsiveness and touch gestures
- Sort applications by date, company, or status
- Application timeline view with milestones