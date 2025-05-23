import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/get-all-orders", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(async (res) => {
        const contentType = res.headers.get("content-type");
        if (!res.ok) {
          const errorData = contentType.includes("application/json")
            ? await res.json()
            : {};
          throw new Error(errorData.message || "Failed to fetch orders");
        }
        return res.json();
      })
      .then((data) => {
        setOrders(data.data || []);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setError(err.message);
      });
  }, []);

  const handleCardClick = (userId) => {
    if (userId) navigate(`/user/${userId}`);
  };

  const groupedOrders = orders.reduce((acc, order) => {
    const groupKey = dayjs(order.createdAt).format("YYYY-MM-DD HH:mm");
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(order);
    return acc;
  }, {});

  // ✅ return block must be inside the function
  return (
    <div className="p-4 text-zinc-100 pt-[90px]">
      <h1 className="text-3xl md:text-5xl font-semibold text-zinc-500 mb-8">All Orders</h1>

      {error && <div className="text-red-500">{error}</div>}

      {Object.keys(groupedOrders).length === 0 ? (
        <div className="text-center text-zinc-400 mt-20">
          <p className="text-2xl">No orders found.</p>
          <img
            src="https://cdn-icons-png.flaticon.com/128/9961/9961218.png"
            alt="No Orders"
            className="mx-auto h-[20vh] mt-4"
          />
        </div>
      ) : (
        Object.entries(groupedOrders).map(([dateTime, ordersInGroup], idx) => (
          <div
            key={dateTime}
            className="bg-zinc-800 mb-6 p-4 rounded-lg shadow-lg"
          >
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-blue-400">
                {dayjs(dateTime).format("MMMM D, YYYY - HH:mm")}
              </h2>
              <p className="text-sm text-zinc-400">Total Orders: {ordersInGroup.length}</p>
            </div>

            <div className="flex flex-wrap gap-4 overflow-x-auto">
              {ordersInGroup.map((order) => (
                <div
                  key={order._id}
                  className="min-w-[250px] bg-zinc-900 p-4 rounded shadow hover:bg-zinc-950 cursor-pointer transition-all"
                  onClick={() => handleCardClick(order.user?._id)}
                >
                  <h3 className="font-bold text-white text-md mb-1">
                    {order.book?.title || "Unknown Title"}
                  </h3>
                  <p className="text-sm text-zinc-400 mb-1">
                    <strong>User:</strong> {order.user?.username || "N/A"}
                  </p>
                  <p className="text-sm text-zinc-400 mb-1">
                    <strong>Price:</strong> ${order.book?.price || "N/A"}
                  </p>
                  <p className="text-sm">
                    <strong>Status: </strong>
                    <span
                      className={`font-semibold ${
                        order.status === "Order placed"
                          ? "text-yellow-400"
                          : order.status === "canceled"
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      {order.status}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AllOrders;
