// filepath: /home/elnop/Documents/ft_transcendence/frontend/src/js/socket-test.js
import websocketManager from './utils/websocketManager';

export function loadSocketTestPage() {
    const connectBtn = document.getElementById('connect-socket');
    const disconnectBtn = document.getElementById('disconnect-socket');
    const clearLogBtn = document.getElementById('clear-log');
    const sendMessageBtn = document.getElementById('send-message');
    const messageInput = document.getElementById('message-input');
    const socketLog = document.getElementById('socket-log');

    // Log function to show events in the UI
    function log(message, type = 'info') {
        const timestamp = new Date().toISOString().slice(11, 23);
        const entry = document.createElement('div');
        entry.className = type;
        entry.textContent = `[${timestamp}] ${message}`;
        socketLog.appendChild(entry);
        socketLog.scrollTop = socketLog.scrollHeight;
    }

    // Setup WebSocket event listeners
    websocketManager.addEventListener('connected', () => {
        log('WebSocket connected successfully', 'success');
    });

    websocketManager.addEventListener('disconnected', (data) => {
        log(`WebSocket disconnected: code=${data.code}, reason=${data.reason}`, 'info');
    });

    websocketManager.addEventListener('error', (data) => {
        log(`WebSocket error: ${JSON.stringify(data.error)}`, 'error');
    });

    websocketManager.addEventListener('message', (data) => {
        log(`Message received: ${JSON.stringify(data)}`, 'message');
    });

    websocketManager.addEventListener('maxReconnectAttemptsReached', () => {
        log('Maximum reconnection attempts reached. Please retry manually.', 'error');
    });

    // Button event handlers
    connectBtn.addEventListener('click', () => {
        log('Attempting to connect WebSocket...');
        websocketManager.connect();
    });

    disconnectBtn.addEventListener('click', () => {
        log('Disconnecting WebSocket...');
        websocketManager.disconnect();
    });

    clearLogBtn.addEventListener('click', () => {
        socketLog.innerHTML = '';
        log('Log cleared', 'info');
    });

    sendMessageBtn.addEventListener('click', () => {
        const messageText = messageInput.value.trim();
        if (!messageText) {
            log('Please enter a message to send', 'error');
            return;
        }

        try {
            // Try to parse as JSON first
            let messageData;
            try {
                messageData = JSON.parse(messageText);
            } catch (e) {
                // If not valid JSON, send as string
                messageData = messageText;
            }

            const success = websocketManager.send(messageData);
            if (success) {
                log(`Message sent: ${messageText}`, 'success');
            } else {
                log('Failed to send message - WebSocket not connected', 'error');
            }
        } catch (error) {
            log(`Error sending message: ${error.message}`, 'error');
        }
    });

    // Add keyboard shortcut for sending messages
    messageInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && event.ctrlKey) {
            sendMessageBtn.click();
        }
    });

    // Initial log message
    log('WebSocket test page loaded. Click "Connect WebSocket" to begin.', 'info');
}