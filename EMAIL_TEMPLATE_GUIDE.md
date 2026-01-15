# Customize Supabase Email Templates

Your app now shows better error messages and a nice confirmation screen after signup. To remove Supabase branding and customize the emails, follow these steps:

## Step 1: Access Email Templates in Supabase

1. Go to [Supabase Console](https://app.supabase.com/)
2. Select your project (nwomyemjcvfwsddnxvvx)
3. Go to **Authentication** → **Email Templates** (in left sidebar)

## Step 2: Customize the Confirmation Email

Click on the **"Confirm signup"** email template and replace the content with:

```html
<h2>Welcome to Job Board! 👋</h2>

<p>Thanks for signing up! Click the button below to confirm your email address.</p>

<p>
  <a href="{{ .ConfirmationURL }}" style="
    display: inline-block;
    padding: 12px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-decoration: none;
    border-radius: 6px;
    font-weight: bold;
  ">
    Confirm Email
  </a>
</p>

<p style="color: #666; font-size: 14px;">
  Or copy this link: {{ .ConfirmationURL }}
</p>

<p style="color: #999; font-size: 12px; margin-top: 20px;">
  If you didn't create this account, you can ignore this email.
</p>
```

## Step 3: Customize the Password Reset Email (Optional)

If you want to add password reset functionality later, customize that template too:

```html
<h2>Reset Your Password 🔑</h2>

<p>Click the button below to reset your password.</p>

<p>
  <a href="{{ .ConfirmationURL }}" style="
    display: inline-block;
    padding: 12px 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    text-decoration: none;
    border-radius: 6px;
    font-weight: bold;
  ">
    Reset Password
  </a>
</p>

<p style="color: #666; font-size: 14px;">
  Or copy this link: {{ .ConfirmationURL }}
</p>

<p style="color: #999; font-size: 12px; margin-top: 20px;">
  This link expires in 24 hours. If you didn't request this, you can ignore this email.
</p>
```

## Variables You Can Use

- `{{ .ConfirmationURL }}` - The confirmation link
- `{{ .Email }}` - User's email address
- `{{ .SiteURL }}` - Your site URL (e.g., http://localhost:5174)

## After Customization

Once you update the templates:
1. Click **Save** in the Supabase editor
2. New signup confirmation emails will use your custom template
3. They'll show your branding instead of Supabase's

## Testing

To test:
1. Sign up with a test email
2. Check your email inbox for the confirmation email
3. It should now show your custom design without Supabase branding
