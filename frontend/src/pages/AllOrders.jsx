import React, { useEffect, useState } from "react";

function AllOrders() {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Connect to WebSocket with path /ws
    const socket = new WebSocket("ws://localhost:3000/ws");

    socket.onopen = () => {
      console.log("WebSocket connected");
      // Optionally send a message
      socket.send(JSON.stringify({ type: "hello", payload: "client connected" }));
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received from WS:", data);
        setMessages(prev => [...prev, data]);
      } catch (e) {
        console.error("Invalid JSON from WS:", e);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    setWs(socket);

    // Cleanup on unmount
    return () => {
      socket.close();
    };
  }, []);

  return (
    <div>
      <h2>All Orders WebSocket Messages</h2>
      <ul>
        {messages.map((msg, i) => (
          <li key={i}>{JSON.stringify(msg)}</li>
        ))}
      </ul>
    </div>
  );
}

export default AllOrders;
