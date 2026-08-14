require('dotenv').config();
const connectDB = require('./config/db');
const app = require('./app');

connectDB();

const PORT = process.env.PORT || 3009;
app.listen(PORT, () => console.log(`Coupon service running on port ${PORT}`));
