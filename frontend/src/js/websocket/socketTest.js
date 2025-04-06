// WebSocket connection test for user status
export function initWebSocketTest() {
    const statusSocket = new WebSocket(
        `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws/status/`
        // `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws/status/`
    );

    statusSocket.onopen = function(e) {
        console.log('WebSocket connection established', e);
        updateConnectionStatus('Connected');
    };

    statusSocket.onmessage = function(e) {
        console.log('WebSocket message received:', e.data);
        const data = JSON.parse(e.data);
        handleWebSocketMessage(data);
    };

    statusSocket.onclose = function(e) {
        console.log('WebSocket connection closed', e);
        updateConnectionStatus('Disconnected');
    };

    statusSocket.onerror = function(e) {
        console.error('WebSocket error:', e);
        updateConnectionStatus('Error');
    };

    // Create a simple test interface
    function createTestUI() {
        // Check if the element already exists
        if (document.getElementById('websocket-test-container')) {
            return;
        }

        const container = document.createElement('div');
        container.id = 'websocket-test-container';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '20px';
        container.style.backgroundColor = 'rgba(203, 137, 200, 0.8)';
        container.style.padding = '15px';
        container.style.borderRadius = '8px';
        container.style.zIndex = '1000';
        container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        container.style.border = '3px solid #452547';

        // Title
        const title = document.createElement('h3');
        title.textContent = 'WebSocket Test';
        title.style.color = '#452547';
        title.style.margin = '0 0 10px 0';
        
        // Connection status
        const statusDiv = document.createElement('div');
        statusDiv.id = 'websocket-status';
        statusDiv.textContent = 'Status: Waiting for connection...';
        statusDiv.style.marginBottom = '10px';
        statusDiv.style.color = '#452547';
        
        // Received messages
        const messagesDiv = document.createElement('div');
        messagesDiv.id = 'websocket-messages';
        messagesDiv.style.maxHeight = '150px';
        messagesDiv.style.overflowY = 'auto';
        messagesDiv.style.marginBottom = '10px';
        messagesDiv.style.padding = '5px';
        messagesDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        messagesDiv.style.borderRadius = '4px';
        messagesDiv.style.color = '#452547';
        messagesDiv.textContent = 'Received messages:';
        
        // Close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close test';
        closeButton.style.padding = '5px 10px';
        closeButton.style.backgroundColor = '#452547';
        closeButton.style.color = '#CB89C8';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '4px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.marginTop = '5px';
        
        closeButton.addEventListener('click', function() {
            document.body.removeChild(container);
            // Close the WebSocket connection if it's still open
            if (statusSocket.readyState === WebSocket.OPEN) {
                statusSocket.close();
            }
        });
        
        // Assemble the elements
        container.appendChild(title);
        container.appendChild(statusDiv);
        container.appendChild(messagesDiv);
        container.appendChild(closeButton);
        
        document.body.appendChild(container);
    }
    
    // Update the connection status in the UI
    function updateConnectionStatus(status) {
        createTestUI(); // Ensure the UI is created
        const statusDiv = document.getElementById('websocket-status');
        if (statusDiv) {
            statusDiv.textContent = `Status: ${status}`;
            
            // Change color based on status
            if (status === 'Connected') {
                statusDiv.style.color = 'green';
            } else if (status === 'Disconnected') {
                statusDiv.style.color = 'orange';
            } else if (status === 'Error') {
                statusDiv.style.color = 'red';
            }
        }
    }
    
    // Handle received messages
    function handleWebSocketMessage(data) {
        const messagesDiv = document.getElementById('websocket-messages');
        if (messagesDiv) {
            const messageElement = document.createElement('div');
            messageElement.textContent = `${new Date().toLocaleTimeString()}: ${JSON.stringify(data)}`;
            messageElement.style.borderBottom = '1px solid #ddd';
            messageElement.style.padding = '3px 0';
            messagesDiv.appendChild(messageElement);
            // Scroll to the last message
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
    }
    
    // Initialize the test UI
    createTestUI();
    
    return statusSocket;
}