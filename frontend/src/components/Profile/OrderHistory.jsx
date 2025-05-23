import React, { useState, useEffect } from 'react';
import axios from "axios";
import Loader from '../Loader/Loader';
import { Link } from "react-router-dom";

const OrderHistory = () => {
  const [groupedOrders, setGroupedOrders] = useState(null);

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/get-order-history", {
          headers,
        });

        const orders = response.data.data;

        // Group by date and time (rounded to minute)
        const groups = orders.reduce((acc, order) => {
          const date = new Date(order.createdAt);
          const key = date.toLocaleString(); // You can change this format as needed
          if (!acc[key]) acc[key] = [];
          acc[key].push(order);
          return acc;
        }, {});

        setGroupedOrders(groups);
      } catch (error) {
        console.error("Failed to fetch order history", error);
        setGroupedOrders({});
      }
    };

    fetchOrders();

    // WebSocket (remains unchanged)
    const socket = new WebSocket("ws://localhost:3000");

    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
      try {
        const updatedOrder = JSON.parse(event.data);
        setGroupedOrders((prevGrouped) => {
          if (!prevGrouped) return prevGrouped;
          const newGrouped = { ...prevGrouped };

          for (const key in newGrouped) {
            newGrouped[key] = newGrouped[key].map(order =>
              order._id === updatedOrder.orderId
                ? { ...order, status: updatedOrder.newStatus }
                : order
            );
          }

          return newGrouped;
        });
      } catch (error) {
        console.error("Error parsing WebSocket message", error);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  return (
    <>
      {!groupedOrders && <Loader />}
      {groupedOrders && Object.keys(groupedOrders).length === 0 && (
        <div className="h-[80vh] p-4 text-zinc-100 flex flex-col items-center justify-center">
          <h1 className="text-5xl font-semibold text-zinc-500 mb-8">No order history</h1>
          <img
            src="https://cdn-icons-png.flaticon.com/128/9961/9961218.png"
            alt="No Orders"
            className="h-[20vh] mb-8"
          />
        </div>
      )}

      {groupedOrders && Object.entries(groupedOrders).map(([timestamp, orders], i) => (
        <div key={i} className="bg-zinc-800 rounded-lg p-4 mb-6 shadow-lg">
          <h2 className="text-xl font-bold text-zinc-400 mb-4">Ordered on: {timestamp}</h2>
          <div className="flex flex-wrap gap-4">
            {orders.map((items, idx) => (
              <div key={idx} className="bg-zinc-900 rounded p-4 w-[300px] shadow">
                <div className="text-lg font-semibold">
                  {items.book ? (
                    <Link
                      to={`/view-book-details/${items.book._id}`}
                      className="hover:text-blue-300"
                    >
                      {items.book.title}
                    </Link>
                  ) : (
                    "Book Unavailable"
                  )}
                </div>
                <p className="text-sm text-zinc-400 mt-2">
                  {items.book ? items.book.desc.slice(0, 60) + "..." : "No Description"}
                </p>
                <p className="mt-2 text-green-300 font-medium">
                  Price: ${items.book ? items.book.price : "N/A"}
                </p>
                <p className="mt-2">
                  Status:{" "}
                  {items.status === "Order placed" ? (
                    <span className="text-yellow-400">{items.status}</span>
                  ) : items.status === "canceled" ? (
                    <span className="text-red-500">{items.status}</span>
                  ) : (
                    <span className="text-green-500">{items.status}</span>
                  )}
                </p>
                <p className="text-sm text-zinc-500 mt-1">Mode: COD</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default OrderHistory;
