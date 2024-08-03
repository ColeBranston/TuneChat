const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080, path: '/ws' });

function parseMessage(messageStr){
    for(let i = 0; i < messageStr.length; i++){
        if(messageStr[i] == "|"){
            return [messageStr.substring(0,i), messageStr.substring(i+1)];
        }
    }
}

async function postMessage(messageStr){
    arr = parseMessage(messageStr);
    email = messageStr[0];
    message = messageStr[1];
    console.log("Email: " + email);
    console.log("Message: " + message);
    await fetch('http://localhost:3000/api/chat', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "email": email,
            "message": newMessage
        })
    });
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