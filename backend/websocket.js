const WebSocket = require('ws');

function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server, path: '/ws' });

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');

    ws.on('message', (message) => {
      console.log('Received message from client:', message);
      // Optional: handle client messages here
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  // Broadcast function to send updated order status to all connected clients
  function sendUpdatedStatus(orderId, newStatus) {
    const data = JSON.stringify({ orderId, newStatus });
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }

  return { sendUpdatedStatus };
}

module.exports = setupWebSocket;
