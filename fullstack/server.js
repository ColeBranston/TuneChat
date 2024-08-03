const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080, path: '/ws' });

function parseMessage(messageStr){
    for(let i = 0; i < messageStr.length; i++){
        if(messageStr[i] == "|"){
            return [messageStr[0:i], messageStr[i+1:]];
        }
    }
}

wss.on('connection', (ws) => {
    console.log('New client connected');
    
    ws.on('message', (message) => {
        console.log('Received message:', message.toString());
        
        // Broadcast the message to all connected clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:8080/ws');