const WebSocket = require('ws');

let wss;

function setupWebSocket(server) {
  wss = new WebSocket.Server({ server, path: "/ws" });

  wss.on('connection', (ws) => {
    console.log('New WebSocket client connected');

    ws.on('message', (message) => {
      console.log('Received:', message);
      // Echo message back to client (for testing)
      ws.send(JSON.stringify({ received: message.toString() }));
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

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
