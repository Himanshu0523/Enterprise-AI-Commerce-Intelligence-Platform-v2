const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3011;

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'notification-service', port: PORT });
});

app.post('/api/notifications/send', (req, res) => {
  const { recipient, channel = 'email', subject, body } = req.body;
  if (!recipient || !body) {
    return res.status(400).json({ success: false, error: 'Recipient and body are required' });
  }

  console.log(`[NOTIFICATION] Dispatching ${channel} to ${recipient}: "${subject || 'Notification'}"`);
  res.status(200).json({
    success: true,
    notificationId: `notif_${Date.now()}`,
    channel,
    recipient,
    status: 'DELIVERED',
  });
});

app.listen(PORT, () => {
  console.log(`Notification Service running on port ${PORT}`);
});
