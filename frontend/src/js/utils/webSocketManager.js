
let userStatusSocket = null;

const SOCKET_ADDR = "localhost:__HTTPS_PORT__"



export function initializeWebSocketConnection() {
    const token = localStorage.getItem('access_token');
    if (!token || token === 'null' || token === 'undefined') {
        return null;
    }
    
    if (!token.includes('.')) {
        return null;
    }
    
    if (userStatusSocket) {
        userStatusSocket.close();
    }
    
    const wssProtocol = 'wss://';
    
    
    const backendHost = SOCKET_ADDR;
    
    const encodedToken = encodeURIComponent(token);
    const wssUrl = `${wssProtocol}${backendHost}/wss/status/?token=${encodedToken}`;
    
    
    userStatusSocket = new WebSocket(wssUrl);
    
    userStatusSocket.onopen = function(event) {
        startPing();
        window.dispatchEvent(new CustomEvent('websocketConnected'));
    };
    
    userStatusSocket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        
        if (data.type === "status_update") {
            window.dispatchEvent(new CustomEvent('userStatusUpdate', { 
                detail: {
                    username: data.username,
                    isOnline: data.is_online
                }
            }));
        }
    };
    
    userStatusSocket.onerror = function(error) {
        if (error.target && error.target.readyState === WebSocket.CLOSED) {
            // console.error("WebSocket connection closed unexpectedly. Check server availability and CORS configuration.");
        }
    };
    
    userStatusSocket.onclose = function(event) {
        if (userStatusSocket && userStatusSocket.pingInterval) {
            clearInterval(userStatusSocket.pingInterval);
            userStatusSocket.pingInterval = null; 
        }
        
        if (event.code !== 1000) { // 1000 est le code de fermeture normale
            setTimeout(() => {
                initializeWebSocketConnection();
            }, 5000);
        }
    };
    
    function startPing() {
        const pingInterval = setInterval(() => {
            if (userStatusSocket && userStatusSocket.readyState === WebSocket.OPEN) {
                userStatusSocket.send(JSON.stringify({type: "ping"}));
            } else {
                clearInterval(pingInterval);
            }
        }, 30000);
        
        userStatusSocket.pingInterval = pingInterval;
    }
    
    window.userStatusSocket = userStatusSocket;
    
    return userStatusSocket;
}


export function closeWebSocketConnection() {
    if (userStatusSocket) {
        if (userStatusSocket.pingInterval) {
            clearInterval(userStatusSocket.pingInterval);
            userStatusSocket.pingInterval = null;
        }
        
        userStatusSocket.close(1000); 
        userStatusSocket = null;
        window.userStatusSocket = null;
    }
}
