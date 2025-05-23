require('dotenv').config();
const express = require("express");
const cors = require("cors");
const http = require('http');
const path = require("path");

require("./conn/conn");

const userRoutes = require("./routes/user");
const bookRoutes = require("./routes/book");
const favouriteRoutes = require("./routes/favourite");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
const OrderModel = require("./models/order");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", userRoutes);
app.use("/api/v1", bookRoutes);
app.use("/api/v1", favouriteRoutes);
app.use("/api/v1", cartRoutes);
app.use("/api/v1", orderRoutes);

app.use("/images", express.static(path.join(__dirname, "public/images")));

const server = http.createServer(app);

// Import setupWebSocket correctly and initialize
const setupWebSocket = require('./websocket');
const { sendUpdatedStatus } = setupWebSocket(server);

app.post('/api/v1/admin/update-order-status', async (req, res) => {
  try {
    const { orderId, newStatus } = req.body;
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    order.status = newStatus;
    await order.save();

    // Send real-time update to WebSocket clients
    sendUpdatedStatus(orderId, newStatus);

    res.status(200).json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Failed to update order status" });
  }
});

server.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
