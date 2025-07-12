const { Client } = require('whatsapp-web.js');
const express = require('express');
const qrcode = require('qrcode-terminal');

const app = express();
app.use(express.json());

const client = new Client();

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
  console.log('Scan the QR code above with WhatsApp on your phone');
});

client.on('ready', () => {
  console.log('WhatsApp client is ready!');
});

client.initialize();

app.post('/send', async (req, res) => {
  const { phone, message } = req.body;

  if (!phone || !message) {
    return res.status(400).send('Missing phone or message');
  }

  const chatId = `${phone}@c.us`;

  try {
    await client.sendMessage(chatId, message);
    res.send('Message sent');
  } catch (err) {
    res.status(500).send('Failed to send message');
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
