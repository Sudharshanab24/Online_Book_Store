const router = require("express").Router();
const { authenticateToken } = require("./userAuth");
const Book = require("../models/book");
const Order = require("../models/order");
const User = require("../models/user");

// Import sendUpdatedStatus from app.js
const { sendUpdatedStatus } = require("../app");

// Place order
router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { order } = req.body;

    for (const orderData of order) {
      const newOrder = new Order({ user: userId, book: orderData._id });
      const orderDataFromDb = await newOrder.save();

      await User.findByIdAndUpdate(userId, {
        $push: { orders: orderDataFromDb._id },
      });

      await User.findByIdAndUpdate(userId, {
        $pull: { cart: orderData._id },
      });
    }

    return res.json({
      status: "Success",
      message: "Order placed successfully",
    });
  } catch (error) {
    console.log("Error placing order:", error);
    res.status(500).json({ status: "Error", message: "Internal server error" });
  }
});

// Get order history
router.get("/get-order-history", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userData = await User.findById(userId).populate({
      path: "orders",
      populate: { path: "book" },
    });

    if (!userData) return res.status(404).json({ message: "User not found" });

    const ordersData = userData.orders.reverse();
    return res.json({ status: "Success", data: ordersData });
  } catch (error) {
    console.error("Error fetching order history:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get all orders (admin)
router.get("/get-all-orders", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ status: "Error", message: "Access denied" });
    }

    const orders = await Order.find()
      .populate("book")
      .populate("user")
      .sort({ createdAt: -1 });

    return res.json({ status: "Success", data: orders });
  } catch (error) {
    console.log("Error fetching orders:", error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// Update Order Status (admin)
router.patch("/update-status/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    // Notify all WebSocket clients about the status update
    sendUpdatedStatus(order._id.toString(), status);

    // Return updated user with populated orders
    const updatedUser = await User.findById(order.user).populate({
      path: "orders",
      populate: { path: "book" },
    });

    res.status(200).json({ message: "Order status updated", user: updatedUser });
  } catch (error) {
    console.error("Status update error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
