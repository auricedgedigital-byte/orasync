# Step-by-Step Guide: Deploy Orasync to orasync.site

## Current Status
✅ Domain added to Cloudflare
✅ Nameservers updated
✅ Production environment configured
✅ NextAuth secret generated

## Step 1: Install Cloudflare Tunnel

### Option A: Manual Download (Easiest)
1. Download cloudflared from: https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe
2. Save it to: `C:\Program Files\cloudflared\cloudflared.exe`
3. Add `C:\Program Files\cloudflared` to your PATH

### Option B: Run PowerShell Script
```powershell
# Run as Administrator
Set-ExecutionPolicy Bypass -Scope Process -Force
.\install-cloudflared.ps1
```

## Step 2: Login to Cloudflare

Open PowerShell and run:
```powershell
cloudflared tunnel login
```

This will open your browser. Login with your Cloudflare account.

## Step 3: Create Tunnel

```powershell
cloudflared tunnel create orasync
```

Copy the Tunnel ID that appears (looks like: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)

## Step 4: Create Configuration File

Create file: `C:\Users\ADMIN\.cloudflared\config.yml`

```yaml
tunnel: <YOUR_TUNNEL_ID>
credentials-file: C:\Users\ADMIN\.cloudflared\<YOUR_TUNNEL_ID>.json

ingress:
  - hostname: orasync.site
    service: http://localhost:3000
  - hostname: www.orasync.site
    service: http://localhost:3000
  - service: http_status:404
```

Replace `<YOUR_TUNNEL_ID>` with the ID from Step 3.

## Step 5: Route DNS

```powershell
cloudflared tunnel route dns orasync orasync.site
cloudflared tunnel route dns orasync www.orasync.site
```

## Step 6: Build Production App

In your project directory:
```powershell
cd C:\Users\ADMIN\Downloads\dashboardv1122

# Build for production
npm run build
```

## Step 7: Start Application

```powershell
# Set production environment
$env:NODE_ENV="production"

# Start the app
npm start
```

Keep this terminal open!

## Step 8: Start Tunnel (New Terminal)

Open a NEW PowerShell window:
```powershell
cloudflared tunnel run orasync
```

Keep this terminal open too!

## Step 9: Test Your Site

Open browser and go to: **https://orasync.site**

You should see your Orasync app running!

## Step 10: Keep It Running

### Install PM2 (Process Manager)
```powershell
npm install -g pm2-windows-service
npm install -g pm2

# Start app with PM2
pm2 start npm --name "orasync" -- start
pm2 save
```

### Install Cloudflared as Service
```powershell
cloudflared service install
```

Now both will auto-start on boot!

## Troubleshooting

### Tunnel not connecting?
- Check if app is running on port 3000
- Verify config.yml has correct tunnel ID
- Check cloudflared logs

### Domain not working?
- Wait 5-10 minutes for DNS propagation
- Check Cloudflare dashboard → Zero Trust → Access → Tunnels
- Verify tunnel status is "Healthy"

### Port 3000 already in use?
- Stop the dev server (Ctrl+C in the terminal running `npm run dev`)
- Or change port in config.yml

## Next Steps

1. ✅ Site is live!
2. Set up Google OAuth (next guide)
3. Add authentication pages
4. Test all features

---

**Need help?** Check the tunnel status:
```powershell
cloudflared tunnel info orasync
```
