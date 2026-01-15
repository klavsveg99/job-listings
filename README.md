# Job Listing Board 📋

A modern, full-stack job tracking application built with React, TypeScript, and Supabase. Manage your job applications in one place, track their status, and never lose sight of your job search progress.

## 🚀 Features

### Authentication
- **Sign up / Login** with email and password
- **Email confirmation** required before account activation
- **Secure sessions** with Supabase authentication
- **Automatic logout** support

### Job Management
- **Add Jobs** with detailed information
- **Edit Jobs** by clicking on any job card
- **Delete Jobs** with confirmation
- **Track Status** with 5 predefined states:
  - 💾 **Saved** - Jobs you're interested in
  - ✅ **Applied** - Applications submitted
  - 🎤 **Interview Stage** - In the interview process
  - ❌ **Rejected** - Applications declined
  - 🎉 **Offer** - Job offers received

### Additional Fields
- **Job Title** (required)
- **Company** (required)
- **Job URL** - Link to the job posting
- **Notes** - Personal notes about the job
- **Created Date** - When you added the job

### User Experience
- **Real-time Updates** - Jobs sync instantly across sessions
- **Responsive Design** - Works on desktop and mobile
- **Beautiful UI** - Modern purple gradient theme
- **Click to Edit** - Click any job card to edit all fields
- **Quick Status Change** - Click the status badge to change it

## 🛠️ Tech Stack

- **Frontend:** React 19 + TypeScript
- **Build Tool:** Vite
- **Backend/Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Styling:** CSS3

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js (v16 or higher)
- npm or yarn package manager
- A Supabase project account

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/klavsveg99/job-listings.git
cd job-listings
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Database
1. Go to [Supabase Console](https://app.supabase.com/)
2. Select your project
3. Open **SQL Editor** → **New Query**
4. Copy and paste the contents of `DATABASE_SETUP.sql`
5. Click **Run** to create the jobs table and security policies

### 4. Configure Supabase Credentials
The app already has Supabase credentials configured in `src/supabaseClient.ts`. If you need to update them:

```typescript
const supabaseUrl = 'your-supabase-url'
const supabaseKey = 'your-supabase-key'
```

### 5. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5174/`

## 🔧 Available Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Auth.tsx              # Login/signup form
│   ├── Auth.css
│   ├── Header.tsx            # Top navigation bar
│   ├── Header.css
│   ├── JobBoard.tsx          # Main job list display
│   ├── JobBoard.css
│   ├── AddJobForm.tsx        # Form for adding/editing jobs
│   ├── AddJobForm.css
│   ├── JobCard.tsx           # Individual job card
│   └── JobCard.css
├── contexts/
│   └── AuthContext.tsx       # Authentication state management
├── supabaseClient.ts         # Supabase client setup
├── App.tsx                   # Main app component
├── App.css
├── main.tsx                  # Entry point
└── index.css                 # Global styles
```

## 🗄️ Database Schema

### Jobs Table
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

### Row Level Security
All data is protected by RLS policies:
- ✅ Users can only view their own jobs
- ✅ Users can only create/update/delete their own jobs
- ✅ Other users cannot access any data

## 📧 Email Customization

To customize signup confirmation emails and remove Supabase branding:

1. Go to Supabase Console → **Authentication** → **Email Templates**
2. Edit the **"Confirm signup"** template
3. See `EMAIL_TEMPLATE_GUIDE.md` for pre-made templates

## 🔐 Security Features

- **Email Confirmation** - Users must verify their email before using the app
- **Duplicate Email Prevention** - Cannot sign up with the same email twice
- **Row Level Security** - Database enforces user isolation at the SQL level
- **Secure Sessions** - Session tokens managed by Supabase
- **Type Safety** - Full TypeScript coverage

## 🚀 Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload the dist/ folder to Netlify
```

### Deploy to Other Platforms
1. Run `npm run build` to create the production build
2. Deploy the `dist/` folder to your hosting service

## 📝 Usage Guide

### Adding a Job
1. Click **"+ Add New Job"**
2. Fill in job title and company (required)
3. Optionally add job URL and notes
4. Set the initial status (default: "Saved")
5. Click **"Add Job"**

### Editing a Job
1. Click on any job card
2. The form will open with all fields pre-populated
3. Make your changes
4. Click **"Save Changes"**

### Changing Job Status
- **Quick Change:** Click the colored status badge on the job card
- **In Edit Mode:** Change the status dropdown when editing the job

### Deleting a Job
1. Click the **X** button on the job card
2. Confirm the deletion

### Logging Out
1. Click your email in the top right
2. Click **"Logout"**

## 🐛 Troubleshooting

### "An error occurred" when adding jobs
- Make sure you've set up the database using `DATABASE_SETUP.sql`
- Check that the `jobs` table exists in Supabase

### Can't sign up with same email twice
- This is by design for security
- If you forgot your password, use the sign-in form (password reset coming soon)

### Jobs not persisting after refresh
- Make sure you're logged in (check Supabase authentication)
- Verify Row Level Security policies are enabled

### Email confirmation not arriving
- Check spam/junk folder
- Ensure email is confirmed in Supabase authentication settings
- See `EMAIL_CONFIRMATION_SETUP.md` for setup guide

## 🎯 Future Enhancements

Potential features for future versions:
- [ ] Password reset functionality
- [ ] Interview reminders and notes
- [ ] Salary tracking and comparison
- [ ] Company ratings and reviews
- [ ] Export jobs to CSV
- [ ] Job search and filtering
- [ ] Multiple job board templates
- [ ] Email notifications
- [ ] Dark mode

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repository and submit pull requests.

## 📞 Support

For issues, questions, or suggestions:
1. Check the troubleshooting section above
2. Review the setup guides: `DATABASE_SETUP.sql`, `EMAIL_CONFIRMATION_SETUP.md`, `EMAIL_TEMPLATE_GUIDE.md`
3. Open an issue on GitHub

## 👤 Author

Created with ❤️ for job seekers everywhere
