# Enable Email Confirmation in Supabase

To prevent duplicate email signups, you need to enable email confirmation. Follow these steps:

## Step 1: Go to Authentication Settings

1. Open [Supabase Console](https://app.supabase.com/)
2. Select your project
3. Go to **Authentication** → **Providers** (in left sidebar)
4. Click on **Email** tab

## Step 2: Enable Email Confirmation

Look for the section called **"Email confirmations"** or **"Require email confirmation to sign up"**

- Toggle it **ON** (it should be enabled)
- Make sure it says something like "Users will need to verify their email address before they can sign in"

## Step 3: Verify Auto-confirm is OFF

Make sure you're **NOT** auto-confirming emails. You should see something like:
- ❌ Auto-confirm users (should be OFF)
- ✅ Require email confirmation (should be ON)

## Step 4: Test It

Once enabled:
1. Try to sign up with a new email → You'll get the confirmation screen
2. Try to sign up with the SAME email again → You should get an error "This email is already registered"
3. This works because the first email is now in the system (even if not confirmed yet)

## If You Already Signed Up

If you already created test accounts, they might be unconfirmed. To clean them up:
1. Go to **Authentication** → **Users**
2. Find the test accounts
3. Delete them
4. Then try signing up again

This will ensure the duplicate detection works properly.
