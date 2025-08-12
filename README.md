# 🤖 Interactive Telegram Bot Setup with Vercel

This project creates an interactive Telegram bot that handles meal orders with visual feedback.

## 🚀 Quick Deploy to Vercel

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Deploy to Vercel
```bash
cd /Users/Volodymyr_Tomurka/temp/zebra/building_ordering
vercel
```

Follow the prompts:
- **Set up and deploy?** → Y
- **Which scope?** → Your username/org
- **Project name?** → meal-ordering-bot (or your choice)
- **Directory?** → ./ (current directory)

### 3. Set Environment Variables
```bash
# Add your bot token to Vercel
vercel env add BOT_TOKEN
# Paste your bot token when prompted
```

### 4. Deploy to Production
```bash
vercel --prod
```

### 5. Set Telegram Webhook
```bash
./setup-webhook.sh YOUR_BOT_TOKEN https://your-app.vercel.app
```

## 🎯 Interactive Features Added

### ✅ **Confirmed Orders**
- Green highlighting with emojis 🟢
- Timestamp and staff name
- Additional "Kitchen Notification" message
- New buttons: "Mark as Preparing" / "Mark as Ready"

### ❌ **Rejected Orders** 
- Red highlighting with emojis 🔴
- Timestamp and staff name
- Reason field for clarity

### 🔔 **User Experience**
- **Popup alerts** when buttons are clicked
- **Visual feedback** with colors and emojis
- **Button removal** after action to prevent double-clicks
- **Follow-up actions** for workflow management

## 🛠 Configuration

### Environment Variables
- `BOT_TOKEN`: Your Telegram bot token from @BotFather

### Webhook URL
- Production: `https://your-app.vercel.app/api/telegram-webhook`
- Local dev: `http://localhost:3000/api/telegram-webhook`

## 🧪 Testing

1. **Send a test order** through your web form
2. **Check Telegram** for the message with buttons
3. **Click Accept/Reject** and see the interactive updates
4. **Verify** popup notifications appear

## 📱 Mobile Friendly

The bot works great on:
- Desktop Telegram
- Telegram mobile apps  
- Telegram Web

## 🚀 Advanced Features

### Additional Actions
The webhook now supports:
- `confirm_order` → Green highlighting + kitchen notification
- `reject_order` → Red highlighting + rejection notice
- `mark_preparing` → Status update (can be extended)
- `mark_ready` → Order ready notification (can be extended)

### Extensibility
Easy to add more interactive buttons:
```javascript
reply_markup: {
    inline_keyboard: [[
        { text: '🕐 Add 10 min delay', callback_data: 'delay_10' },
        { text: '📞 Call customer', callback_data: 'call_customer' },
        { text: '🚚 Ready for pickup', callback_data: 'ready_pickup' }
    ]]
}
```

## 🔍 Monitoring

- **Vercel Dashboard**: Monitor function calls and performance
- **Console Logs**: Debug webhook interactions
- **Telegram**: See message updates in real-time

## 🎨 Customization

Edit `api/telegram-webhook.js` to:
- Change message formatting
- Add more interactive buttons
- Integrate with external services
- Add custom business logic

---

**🎉 Your bot is now interactive and user-friendly!**
