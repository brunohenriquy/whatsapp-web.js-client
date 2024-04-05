const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth({ clientId: 'test_session', dataPath: './sessions' }),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
    },
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
});

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, { small: true });
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', async () => {
    console.log('Client is ready!');
    try {
        const state = await client.getState();
        console.log('Current state:', state);
    } catch (error) {
        console.error('Error fetching state:', error);
    }
    sendInitialMessage();
});

// client.on('message', msg => {
//     console.log(msg);
//     if (msg.body == '!ping') {
//         msg.reply('pong');
//     }
// });

client.initialize();

function sendInitialMessage() {
    const phoneNumber = '@c.us'; // Add you number before the @
    const message = 'Hello from WhatsApp Web!';

    client.sendMessage(phoneNumber, message).then(() => {
        console.log('Message sent successfully!');
    }).catch(err => {
        console.error('Error sending message:', err);
    });
}