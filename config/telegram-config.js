// Environment configuration for production and testing
const ENV_CONFIG = {
    production: {
        botToken: '8071098931:AAFz_EOIJDp7RrJczbimuIE-sZmXnMPjOi0',
        chatId: '7741980082',
        webhookUrl: 'https://building-ordering-osihw401o-tngmnes-projects.vercel.app/api/telegram-webhook'
    },
    test: {
        botToken: 'YOUR_TEST_BOT_TOKEN_HERE', // Replace with your test bot token
        chatId: 'YOUR_TEST_CHAT_ID_HERE',     // Replace with your test chat ID
        webhookUrl: 'https://building-ordering-test-osihw401o-tngmnes-projects.vercel.app/api/telegram-webhook'
    }
};

// Determine environment (default to production for safety)
const ENVIRONMENT = process.env.NODE_ENV === 'test' ? 'test' : 'production';

// Export current configuration
const TELEGRAM_CONFIG = ENV_CONFIG[ENVIRONMENT];

console.log(`🔧 Using ${ENVIRONMENT} environment`);
console.log(`📱 Bot Token: ${TELEGRAM_CONFIG.botToken.substring(0, 10)}...`);
console.log(`💬 Chat ID: ${TELEGRAM_CONFIG.chatId}`);

// For browser usage (backward compatibility)
if (typeof window !== 'undefined') {
    window.TELEGRAM_CONFIG = TELEGRAM_CONFIG;
}

// For Node.js usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TELEGRAM_CONFIG, ENVIRONMENT };
}
