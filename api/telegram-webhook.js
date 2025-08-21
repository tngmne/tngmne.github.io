// Telegram webhook handler for interactive bot messages
export default async function handler(req, res) {
    if (req.method === 'GET') {
        return res.status(200).json({ 
            message: 'Telegram webhook active',
            timestamp: new Date().toISOString()
        });
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
        const botToken = process.env.BOT_TOKEN;

        console.log(`Processing callback: ${action} for message ${messageId}`);
        console.log(`Full callback_query.data: "${callback_query.data}"`);
        console.log(`Action comparison check:`);
        console.log(`- action === 'waiter_sent': ${action === 'waiter_sent'}`);
        console.log(`- action === 'waiter_ignore': ${action === 'waiter_ignore'}`);
        console.log(`- typeof action: ${typeof action}`);
        console.log(`- action.length: ${action.length}`);
        console.log(`- action char codes: ${Array.from(action).map(c => c.charCodeAt(0)).join(', ')}`);

        let newText;
        let alertText;
        
        if (action === 'confirm_order') {
            newText = `🟢🟢🟢 ORDER CONFIRMED 🟢🟢🟢

✅ **STATUS: APPROVED**
⏰ Confirmed at: ${new Date().toLocaleString('en-US', { 
                timeZone: 'Europe/Podgorica',
                dateStyle: 'short',
                timeStyle: 'medium'
            })}
👤 Staff: ${callback_query.from.first_name || 'Admin'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${originalText}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 **Order is being prepared!**`;
            
            alertText = '✅ Order confirmed successfully!';
            
        } else if (action === 'reject_order') {
            newText = `🔴🔴🔴 ORDER REJECTED 🔴🔴🔴

❌ **STATUS: DECLINED**  
⏰ Rejected at: ${new Date().toLocaleString('en-US', { 
                timeZone: 'Europe/Podgorica',
                dateStyle: 'short',
                timeStyle: 'medium'
            })}
👤 Staff: ${callback_query.from.first_name || 'Admin'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${originalText}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ **Order was declined.**`;
            
            alertText = '❌ Order rejected successfully!';
            
        } else if (action === 'waiter_sent') {
            console.log('✅ WAITER_SENT action detected - processing waiter dispatch');
            newText = `🫅 WAITER REQUEST ✅ HANDLED

A guest has requested waiter assistance.
${originalText.split('\n').slice(2).join('\n')}

✅ **Waiter dispatched by ${callback_query.from.first_name || 'Admin'}**
⏰ Handled at: ${new Date().toLocaleString('en-US', { 
                timeZone: 'Europe/Podgorica',
                dateStyle: 'short',
                timeStyle: 'medium'
            })}`;
            
            alertText = '👨‍🍳 Waiter has been dispatched!';
            
        } else if (action === 'waiter_ignore') {
            console.log('❌ WAITER_IGNORE action detected - processing waiter ignore');
            newText = `🫅 WAITER REQUEST ❌ IGNORED

A guest has requested waiter assistance.
${originalText.split('\n').slice(2).join('\n')}

❌ **Request ignored by ${callback_query.from.first_name || 'Admin'}**
⏰ Ignored at: ${new Date().toLocaleString('en-US', { 
                timeZone: 'Europe/Podgorica',
                dateStyle: 'short',
                timeStyle: 'medium'
            })}`;
            
            alertText = '❌ Waiter request ignored.';
            
        } else {
            // Handle unknown actions
            console.log(`❓ UNKNOWN ACTION received: "${action}"`);
            console.log(`Action details: length=${action.length}, type=${typeof action}`);
            console.log(`Char codes: ${Array.from(action).map(c => c.charCodeAt(0)).join(', ')}`);
            newText = `❓ UNKNOWN ACTION: ${action}\n\n${originalText}`;
            alertText = `❓ Unknown action: ${action}`;
        }

        console.log(`Alert text for ${action}: ${alertText}`);

        // Send callback answer (popup alert)
        await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                callback_query_id: callbackQueryId,
                text: alertText,
                show_alert: true
            })
        });

        // Edit the message with visual feedback
        const editResponse = await fetch(`https://api.telegram.org/bot${botToken}/editMessageText`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                message_id: messageId,
                text: newText,
                parse_mode: 'Markdown'
            })
        });

        if (!editResponse.ok) {
            const errorData = await editResponse.text();
            console.error('Failed to edit message:', errorData);
        }

        // Send follow-up notification based on action type
        if (action === 'confirm_order' || action === 'reject_order') {
            // Kitchen notification for orders
            const kitchenStatus = action === 'confirm_order' ? '🟢 CONFIRMED' : '🔴 REJECTED';
            const kitchenMessage = `🔔 **Kitchen Notification**

Order Status Update: ${kitchenStatus}
Time: ${new Date().toLocaleString('en-US', { 
    timeZone: 'Europe/Podgorica',
    dateStyle: 'short',
    timeStyle: 'medium'
})}

Please check the updated order above.`;

            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: kitchenMessage,
                    parse_mode: 'Markdown'
                })
            });
            
        } else if (action === 'waiter_sent') {
            // Service notification for waiter dispatch
            const serviceMessage = `🏃‍♂️ **Service Update**

Waiter dispatched to guest location.
Staff member: ${callback_query.from.first_name || 'Admin'}
Time: ${new Date().toLocaleString('en-US', { 
    timeZone: 'Europe/Podgorica',
    dateStyle: 'short',
    timeStyle: 'medium'
})}

✅ Guest assistance in progress.`;

            await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: serviceMessage,
                    parse_mode: 'Markdown'
                })
            });
        }

        console.log(`Successfully processed ${action} for message ${messageId}`);
        return res.status(200).json({ ok: true, message: 'Callback processed' });
        
    } catch (error) {
        console.error('Error processing callback:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
