const WebSocket = require('ws');

async function fetchWrapper(...args) {
    const fetch = await import('node-fetch');
    return fetch.default(...args);
}

const wss = new WebSocket.Server({ port: 8080, path: '/ws' });

function parseMessage(messageStr){
    for(let i = 0; i < messageStr.length; i++){
        if(messageStr[i] === "|"){
            return [messageStr.substring(0, i), messageStr.substring(i + 1)];
        }
    }
}

async function postMessage(messageObj){
    if (messageObj.type === 'join') {
        return; // Ignore join messages
    }
    console.log("messageObj", messageObj);
    const arr = parseMessage(messageObj);
    console.log("arr", arr);
    const email = arr[0];
    const message = arr[1];
    await fetchWrapper('http://localhost:3000/api/chat', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "email": email,
            "message": message
        })
    });
}

wss.on('connection', (ws) => {
    console.log('New client connected');
    
    ws.on('message', (message) => {
        console.log('Received message:', message.toString());
        const messageObj = message.toString();
        postMessage(messageObj);
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN && messageObj.type !== 'join') {
                client.send(message.toString());
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:8080/ws');
