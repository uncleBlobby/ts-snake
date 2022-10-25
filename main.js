let main = document.getElementById("main");

// Create WebSocket connection.
const socket = new WebSocket('ws://localhost:8000');

// Connection opened
socket.addEventListener('open', (event) => {
    socket.send('Hello Server!');
});

// Listen for messages
socket.addEventListener('message', (event) => {
    console.log(`Message from server`, event.data);
    main.textContent = event.data;
});
