# Quick Start: Deploy Orasync with Cloudflare Tunnel (FREE)

This guide will get orasync.site live in 15 minutes using your local machine.

## Prerequisites
- Your computer running Windows
- Node.js installed (already have it)
- orasync.site domain access

## Step 1: Install Cloudflare Tunnel (2 minutes)

Open PowerShell as Administrator and run:
```powershell
# Download Cloudflare Tunnel
Invoke-WebRequest -Uri "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe" -OutFile "cloudflared.exe"

# Move to a permanent location
Move-Item cloudflared.exe C:\Windows\System32\cloudflared.exe
```

## Step 2: Login to Cloudflare (2 minutes)

```powershell
cloudflared tunnel login
```

This will open your browser. Login with your Cloudflare account (or create one free).

## Step 3: Create Tunnel (1 minute)

```powershell
cloudflared tunnel create orasync
```

This creates a tunnel and saves credentials.

## Step 4: Create Configuration File (3 minutes)

Create file: `C:\Users\ADMIN\.cloudflared\config.yml`

```yaml
tunnel: orasync
credentials-file: C:\Users\ADMIN\.cloudflared\<TUNNEL-ID>.json

ingress:
  - hostname: orasync.site
    service: http://localhost:3000
  - hostname: www.orasync.site
    service: http://localhost:3000
  - service: http_status:404
```

Replace `<TUNNEL-ID>` with the ID from step 3.

## Step 5: Configure DNS (2 minutes)

```powershell
cloudflared tunnel route dns orasync orasync.site
cloudflared tunnel route dns orasync www.orasync.site
```

## Step 6: Start Your App (1 minute)

In your project directory:
```powershell
cd C:\Users\ADMIN\Downloads\dashboardv1122
npm run build
npm start
```

## Step 7: Start Tunnel (1 minute)

In a new PowerShell window:
```powershell
cloudflared tunnel run orasync
```

## Step 8: Test (1 minute)

Open browser and go to: https://orasync.site

✅ Your app is now live!

## Keep It Running

### Option A: Run in Background
```powershell
cloudflared service install
```

### Option B: Auto-start on Boot
Create a scheduled task to run cloudflared on startup.

## Troubleshooting

**Tunnel not connecting?**
- Check if app is running on port 3000
- Verify config.yml path is correct

**Domain not working?**
- Wait 5 minutes for DNS propagation
- Check Cloudflare dashboard for tunnel status

**App crashes?**
- Use PM2 to keep app running:
```powershell
npm install -g pm2
pm2 start npm --name "orasync" -- start
pm2 save
```

## Next Steps

1. Set up Google OAuth (I'll guide you)
2. Configure production environment variables
3. Test authentication
4. You're live!

Ready to start? Let me know and I'll walk you through each step!
