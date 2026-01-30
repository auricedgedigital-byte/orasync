# Fix Email Confirmation Issues

## 1. Configure Email in Supabase

Go to your Supabase Dashboard → Settings → Authentication → Email

**SMTP Settings:**
- **Provider**: Custom SMTP
- **SMTP Host**: mail.orasync.site
- **SMTP Port**: 587
- **SMTP User**: EMAIL_USER from Vercel
- **SMTP Password**: EMAIL_PASSWORD from Vercel
- **Sender Email**: EMAIL_FROM from Vercel
- **Sender Name**: Orasync
- **Enable SSL/TLS**: Yes

## 2. Configure OAuth Redirect URIs

### Google Cloud Console:
Add these to your Google OAuth app:
```
https://orasync.site/auth/callback/google
https://www.orasync.site/auth/callback/google
http://localhost:3000/auth/callback/google
```

### Facebook Developer Settings:
```
https://orasync.site/auth/callback/facebook
https://www.orasync.site/auth/callback/facebook
http://localhost:3000/auth/callback/facebook
```

### GitHub OAuth Settings:
```
https://orasync.site/auth/callback/github
https://www.orasync.site/auth/callback/github
http://localhost:3000/auth/callback/github
```

## 3. Add Environment Variables to Vercel

Copy these to your Vercel environment variables:
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-secret
FACEBOOK_CLIENT_ID=your-facebook-id  
FACEBOOK_CLIENT_SECRET=your-facebook-secret
GITHUB_CLIENT_ID=your-github-id
GITHUB_CLIENT_SECRET=your-github-secret
```

## 4. Test After Configuration

1. **Email Signup**: Should receive confirmation email
2. **OAuth Login**: Google/Facebook/GitHub should work
3. **Dashboard Access**: Protected routes should work

## Troubleshooting

**Still getting redirect_uri_mismatch?**
- Check for trailing slashes in URLs
- Ensure both www and non-www versions are added
- Wait 5-10 minutes for changes to propagate

**Not receiving confirmation emails?**
- Check SMTP settings in Supabase
- Verify email provider isn't blocking emails
- Check spam folder