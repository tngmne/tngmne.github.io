#!/bin/bash

# Deployment script for production and test environments

echo "🚀 Vercel Deployment Script"
echo "=========================="

# Function to deploy to production
deploy_production() {
    echo "📦 Deploying to PRODUCTION..."
    echo "Using production bot configuration"
    
    # Set production environment variables if not already set
    vercel env add BOT_TOKEN production 8071098931:AAFz_EOIJDp7RrJczbimuIE-sZmXnMPjOi0 2>/dev/null || true
    vercel env add CHAT_ID production 7741980082 2>/dev/null || true
    vercel env add NODE_ENV production production 2>/dev/null || true
    
    # Deploy using main vercel.json
    vercel --prod
    
    echo "✅ Production deployment complete!"
    echo "Environment: PRODUCTION"
    echo "Bot: Live production bot"
}

# Function to deploy to test
deploy_test() {
    echo "🧪 Deploying to TEST..."
    echo "Using test bot configuration"
    
    # Set test environment variables if not already set
    vercel env add TEST_BOT_TOKEN production 8381791930:AAHJpF3MPWJP455DOOkR5yy8vYHGbc3yKoI 2>/dev/null || true
    vercel env add TEST_CHAT_ID production 1138899345 2>/dev/null || true
    vercel env add USE_TEST_BOT production true 2>/dev/null || true
    vercel env add NODE_ENV production test 2>/dev/null || true
    
    # Deploy using test configuration
    vercel --prod --local-config=vercel-test.json
    
    echo "✅ Test deployment complete!"
    echo "Environment: TEST"
    echo "Bot: Test bot (safe for testing)"
}

# Function to show environment status
show_status() {
    echo "📊 Current Environment Variables:"
    echo "================================"
    vercel env ls
}

# Main menu
case "$1" in
    "production"|"prod"|"p")
        deploy_production
        ;;
    "test"|"t")
        deploy_test
        ;;
    "status"|"s")
        show_status
        ;;
    *)
        echo "Usage: $0 [production|test|status]"
        echo ""
        echo "Commands:"
        echo "  production (p) - Deploy to production with live bot"
        echo "  test (t)       - Deploy to test with test bot"
        echo "  status (s)     - Show current environment variables"
        echo ""
        echo "Examples:"
        echo "  $0 production  # Deploy to production"
        echo "  $0 test       # Deploy to test environment"
        echo "  $0 status     # Check current settings"
        ;;
esac
