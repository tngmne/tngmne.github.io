# Testing Environment Setup Guide

## 🎯 Overview
This guide helps you set up a separate testing environment for your Telegram bot to safely test changes before deploying to production.

## 📋 Steps to Set Up Testing

### 1. Create Test Bot
1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Send `/newbot`
3. Name: "Building Ordering Test Bot" (or similar)
4. Username: "building_ordering_test_bot" (or similar)
5. **Save the bot token** you receive

### 2. Get Test Chat ID
1. Open `get-chat-id.html` in your browser
2. Enter your test bot token
3. Start a conversation with your test bot on Telegram
4. Send any message to the test bot
5. Click "Get Chat ID" in the browser
6. **Save the chat ID** you receive

### 3. Configure Test Environment
1. Open `index.html`
2. Find the `ENV_CONFIG.test` section around line 1135
3. Replace `YOUR_TEST_BOT_TOKEN_HERE` with your test bot token
4. Replace `YOUR_TEST_CHAT_ID_HERE` with your test chat ID

### 4. Set Up Vercel Test Environment (Optional)
1. Create test environment variables in Vercel:
   - `TEST_BOT_TOKEN` = your test bot token
   - `TEST_CHAT_ID` = your test chat ID
2. Deploy with test configuration using `vercel-test.json`

## 🔄 How to Use Testing

### Local Testing
1. Open `environment-toggle.html`
2. Switch to "TEST Environment"
3. Open `index.html` - it will now use your test bot
4. Test all functionality safely
5. Switch back to "PRODUCTION Environment" when done

### URL-based Testing
- Add `?test=true` to your URL: `index.html?test=true`
- This forces test mode without using localStorage

### Webhook Testing
- The webhook automatically detects test environment
- Test bot receives waiter requests separately from production

## 🔧 Environment Configuration

### Current Setup
```javascript
// Production (live orders)
production: {
  BOT_TOKEN: '8071098931:AAFz...',
  CHAT_ID: '7741980082'
}

// Testing (safe testing)
test: {
  BOT_TOKEN: 'YOUR_TEST_BOT_TOKEN_HERE',
  CHAT_ID: 'YOUR_TEST_CHAT_ID_HERE'
}
```

### Environment Detection
The system automatically detects test mode based on:
- `localStorage.getItem('useTestBot') === 'true'`
- URL contains `test=true`
- Hostname contains 'test'
- Environment variable `NODE_ENV === 'test'`

## ✅ Testing Checklist

Before deploying to production, test in test environment:
- [ ] Room selection works
- [ ] Order submission works
- [ ] Waiter call button works
- [ ] Both waiter response buttons work correctly
- [ ] Language switching works
- [ ] All order types work (meal, service, etc.)

## 🚀 Deployment Workflow

1. **Develop** → Make changes locally
2. **Test** → Switch to test environment, verify everything works
3. **Deploy** → Switch back to production, commit and push changes
4. **Verify** → Test production deployment with real bot

## 🔍 Debugging

### Check Current Environment
```javascript
// In browser console
console.log('Test mode:', localStorage.getItem('useTestBot'));
console.log('Current config:', TELEGRAM_CONFIG);
```

### Webhook Environment
- Visit `/api/telegram-webhook` to see current webhook environment
- Check Vercel logs for environment detection messages

## 📝 Files Created

- `get-chat-id.html` - Tool to get your test chat ID
- `environment-toggle.html` - Switch between environments
- `vercel-test.json` - Test deployment configuration
- `.env.example` - Environment variables template
- `TESTING-SETUP.md` - This guide
