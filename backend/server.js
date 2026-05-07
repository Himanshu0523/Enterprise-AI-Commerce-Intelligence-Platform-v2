require('dotenv').config();
require('./src/config/passport');
const express = require("express");
const cors = require("cors");
const connectDB = require('./src/config/db');
const passport = require('passport');

// Middlewares
const { handleErrors } = require('./src/middleware/error.middleware');
const { logRequest } = require('./src/middleware/logger.middleware');

// Routes
const authRoutes = require('./src/routes/auth.routes');
const productRoutes = require('./src/routes/product.routes');
const orderRoutes = require('./src/routes/order.routes');
const userRoutes = require('./src/routes/user.routes');
const cartRoutes = require('./src/routes/cart.routes');

const app = express();

connectDB();

app.use(cors());
app.use(passport.initialize());
app.use(express.json());
app.use(logRequest);

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/carts", cartRoutes);

// Error Middleware (must be last)
app.use(handleErrors);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});