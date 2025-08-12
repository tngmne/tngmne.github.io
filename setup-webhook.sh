#!/bin/bash

# Telegram Bot Setup Script
# Run this after deploying to Vercel

echo "🤖 Telegram Bot Webhook Setup"
echo "=============================="

# Check if BOT_TOKEN is provided
if [ -z "$1" ]; then
    echo "❌ Error: Bot token required"
    echo "Usage: ./setup-webhook.sh YOUR_BOT_TOKEN YOUR_VERCEL_URL"
    echo "Example: ./setup-webhook.sh 123456:ABC-DEF... https://your-app.vercel.app"
    exit 1
fi

# Check if VERCEL_URL is provided
if [ -z "$2" ]; then
    echo "❌ Error: Vercel URL required"
    echo "Usage: ./setup-webhook.sh YOUR_BOT_TOKEN YOUR_VERCEL_URL"
    echo "Example: ./setup-webhook.sh 123456:ABC-DEF... https://your-app.vercel.app"
    exit 1
fi

BOT_TOKEN="$1"
VERCEL_URL="$2"
WEBHOOK_URL="${VERCEL_URL}/api/telegram-webhook"

echo "🔗 Setting webhook URL: $WEBHOOK_URL"

# Set the webhook
RESPONSE=$(curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook" \
     -H "Content-Type: application/json" \
     -d "{\"url\": \"${WEBHOOK_URL}\"}")

echo "📡 Telegram API Response:"
echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"

# Check webhook status
echo ""
echo "🔍 Checking webhook status..."
STATUS_RESPONSE=$(curl -s "https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo")
echo "$STATUS_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$STATUS_RESPONSE"

echo ""
echo "✅ Setup complete!"
echo "🧪 Test your webhook by sending a message with buttons to your bot."
