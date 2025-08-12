// Telegram webhook handler for interactive bot messages
export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { callback_query } = req.body;
        
        if (!callback_query) {
            return res.status(200).json({ ok: true, message: 'No callback query' });
        }

        const chatId = callback_query.message.chat.id;
        const messageId = callback_query.message.message_id;
        const originalText = callback_query.message.text;
        const action = callback_query.data;
        const callbackQueryId = callback_query.id;

        console.log(`Processing callback: ${action} for message ${messageId}`);

        let newText;
        let alertText;
        
        if (action === 'confirm_order') {
            newText = `🟢🟢🟢 ORDER CONFIRMED 🟢🟢🟢

✅ **STATUS: APPROVED**
⏰ Confirmed at: ${new Date().toLocaleString('en-US', { 
                timeZone: 'Europe/Kiev',
                dateStyle: 'short',
                timeStyle: 'medium'
            })}
👤 Staff: ${callback_query.from.first_name || 'Admin'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${originalText}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 **Order is being prepared!**`;
            
            alertText = '✅ Order confirmed successfully! Customer will be notified.';
            
        } else if (action === 'reject_order') {
            newText = `🔴🔴🔴 ORDER REJECTED 🔴🔴🔴

❌ **STATUS: DECLINED**
⏰ Rejected at: ${new Date().toLocaleString('en-US', { 
                timeZone: 'Europe/Kiev',
                dateStyle: 'short',
                timeStyle: 'medium'
            })}
👤 Staff: ${callback_query.from.first_name || 'Admin'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${originalText}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💭 **Reason**: Please contact staff for details`;
            
            alertText = '❌ Order rejected. Customer will be notified.';
        } else {
            return res.status(400).json({ error: 'Unknown action' });
        }

        const botToken = process.env.BOT_TOKEN;
        if (!botToken) {
            throw new Error('BOT_TOKEN environment variable not set');
        }

        // Edit the original message
        const editResponse = await fetch(`https://api.telegram.org/bot${botToken}/editMessageText`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                message_id: messageId,
                text: newText,
                parse_mode: 'Markdown',
                reply_markup: null // Remove the buttons
            })
        });

        if (!editResponse.ok) {
            const errorText = await editResponse.text();
            console.error('Error editing message:', errorText);
            throw new Error(`Failed to edit message: ${errorText}`);
        }

        // Answer the callback query with feedback
        const callbackResponse = await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                callback_query_id: callbackQueryId,
                text: alertText,
                show_alert: true // Shows a popup alert
            })
        });

        if (!callbackResponse.ok) {
            const errorText = await callbackResponse.text();
            console.error('Error answering callback:', errorText);
        }

        // Optional: Send a follow-up message for additional actions
        if (action === 'confirm_order') {
            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: `🔔 **Kitchen Notification**: New order confirmed and ready for preparation!`,
                    parse_mode: 'Markdown',
                    reply_markup: {
                        inline_keyboard: [[
                            { text: '👨‍🍳 Mark as Preparing', callback_data: 'mark_preparing' },
                            { text: '✅ Mark as Ready', callback_data: 'mark_ready' }
                        ]]
                    }
                })
            });
        }

        console.log(`Successfully processed ${action} for message ${messageId}`);
        return res.status(200).json({ 
            ok: true, 
            action,
            messageId,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Webhook error:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
}
