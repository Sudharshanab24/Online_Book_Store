require('dotenv').config();

const express = require("express");
const app = express();
const cors = require("cors");
const http = require('http');
const path = require("path");

// Your DB connection and routes (replace with actual files)
require("./conn/conn");

const userRoutes = require("./routes/user");
const Books = require("./routes/book");
const Favourite = require("./routes/favourite");
const Cart = require("./routes/cart");
const Order = require("./routes/order");

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/api/v1", userRoutes);
app.use("/api/v1", Books);
app.use("/api/v1", Favourite);
app.use("/api/v1", Cart);
app.use("/api/v1", Order);

app.use("/images", express.static(path.join(__dirname, "public/images")));

const server = http.createServer(app);

// Setup WebSocket on the same server, specify path "/ws"
const setupWebSocket = require('./websocket');
const { sendUpdatedStatus } = setupWebSocket(server);

app.post('/api/v1/admin/update-order-status', async (req, res) => {
  try {
    const { orderId, newStatus } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = newStatus;
    await order.save();

    // Notify clients
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
