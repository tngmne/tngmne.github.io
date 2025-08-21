# Vercel Environment Configuration Guide

## 🎯 Overview
This guide explains how to set up production and testing environments in Vercel for your Telegram bot ordering system.

## 📋 Step-by-Step Setup

### 1. Set Up Vercel Environment Variables

In your Vercel dashboard, go to your project settings and add these environment variables:

#### Production Environment Variables:
```bash
NODE_ENV = production
BOT_TOKEN = 8071098931:AAFz_EOIJDp7RrJczbimuIE-sZmXnMPjOi0
CHAT_ID = 7741980082
```

#### Test Environment Variables:
```bash
TEST_BOT_TOKEN = 8381791930:AAHJpF3MPWJP455DOOkR5yy8vYHGbc3yKoI
TEST_CHAT_ID = 1138899345
USE_TEST_BOT = true  # Optional: force test mode
```

### 2. Using Vercel CLI (Recommended)

Install Vercel CLI if you haven't:
```bash
npm i -g vercel
vercel login
```

#### Set Production Variables:
```bash
vercel env add NODE_ENV production production
vercel env add BOT_TOKEN production 8071098931:AAFz_EOIJDp7RrJczbimuIE-sZmXnMPjOi0
vercel env add CHAT_ID production 7741980082
```

#### Set Test Variables:
```bash
vercel env add TEST_BOT_TOKEN production 8381791930:AAHJpF3MPWJP455DOOkR5yy8vYHGbc3yKoI
vercel env add TEST_CHAT_ID production 1138899345
vercel env add USE_TEST_BOT production true
```

### 3. Deployment Options

#### Option A: Quick Deployment (using script)
```bash
# Deploy to production (default)
./deploy.sh production

# Deploy to test environment
./deploy.sh test

# Check current environment variables
./deploy.sh status
```

#### Option B: Manual Deployment
```bash
# Deploy to production (default)
vercel --prod

# Deploy with test configuration
vercel --prod --local-config=vercel-test.json
```

### 4. Environment Detection Logic

The system automatically detects the environment based on:

1. **Environment Variable**: `NODE_ENV === 'test'`
2. **Test Flag**: `USE_TEST_BOT === 'true'`
3. **URL Pattern**: URL contains 'test'
4. **Host Pattern**: Host contains 'test'

### 5. Verify Environment

After deployment, check which environment is active:

1. **Visit your webhook**: `https://your-app.vercel.app/api/telegram-webhook`
2. **Check the response**: Shows current environment in JSON
3. **Test mode indicators**: 
   - Version shows "T" for test, "P" for production
   - Orange banner appears in test mode
   - Console logs show environment detection

## 🔄 Switching Environments

### Switch to Test Mode:
```bash
vercel env add USE_TEST_BOT production true
vercel --prod
```

### Switch to Production Mode:
```bash
vercel env rm USE_TEST_BOT production
vercel --prod
```

## 🧪 Testing Workflow

1. **Local Testing**: Use `localStorage.setItem('useTestBot', 'true')`
2. **Staging**: Deploy with test configuration
3. **Production**: Deploy with production configuration

## 📊 Environment Status

Check your current environment variables:
```bash
vercel env ls
```

## 🔧 Troubleshooting

### Issue: Wrong bot is being used
- Check environment variables with `vercel env ls`
- Verify webhook response at `/api/telegram-webhook`
- Check console logs for environment detection

### Issue: Environment not switching
- Clear browser cache
- Check localStorage: `localStorage.getItem('useTestBot')`
- Verify Vercel environment variables are set correctly

## 🚀 Best Practices

1. **Always test first**: Use test environment before production deployment
2. **Verify environment**: Check webhook endpoint after deployment
3. **Monitor logs**: Use Vercel function logs to debug issues
4. **Separate bots**: Keep test and production bots completely separate

## 📁 Configuration Files

- `vercel.json`: Production configuration
- `vercel-test.json`: Test environment configuration
- `deploy.sh`: Automated deployment script
- `.env.example`: Environment variables template
