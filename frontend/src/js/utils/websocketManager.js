import { getApiConfigDefault } from "../api/config/apiConfig";
import { getAccessToken } from "./getAccessToken";

class WebSocketManager {
    constructor() {
        this.socket = null;
        this.connected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectTimeout = null;
        this.eventListeners = {};
    }

    connect() {
        if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
            console.log('WebSocket already connected or connecting');
            return;
        }

        try {
            // Get base URL from API config
            const apiConfig = getApiConfigDefault();
            // Convert http/https to ws/wss
            const wsProtocol = apiConfig.url.startsWith('https') ? 'wss' : 'ws';
            const baseUrl = apiConfig.url.replace(/^http(s?):\/\//, `${wsProtocol}://`);
            
            // Get access token
            const accessToken = getAccessToken();
            
            // Create WebSocket URL
            const socketUrl = `${baseUrl}/ws/status/`;
            console.log(`Attempting to connect WebSocket to ${socketUrl}`);
            
            // Create WebSocket with headers in the protocol field as a workaround
            // Because WebSocket API doesn't support custom headers directly
            this.socket = new WebSocket(socketUrl, [`Authorization: Bearer ${accessToken}`]);
            
            this.socket.onopen = this.onOpen.bind(this);
            this.socket.onclose = this.onClose.bind(this);
            this.socket.onerror = this.onError.bind(this);
            this.socket.onmessage = this.onMessage.bind(this);
        } catch (error) {
            console.error('Error connecting to WebSocket:', error);
            this.scheduleReconnect();
        }
    }

    onOpen(event) {
        console.log('WebSocket connection established');
        this.connected = true;
        this.reconnectAttempts = 0;
        this.dispatchEvent('connected', {});
    }

    onClose(event) {
        console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
        this.connected = false;
        this.dispatchEvent('disconnected', { code: event.code, reason: event.reason });
        this.scheduleReconnect();
    }

    onError(error) {
        console.error('WebSocket error:', error);
        this.dispatchEvent('error', { error });
    }

    onMessage(event) {
        console.log('WebSocket message received:', event.data);
        try {
            const data = JSON.parse(event.data);
            this.dispatchEvent('message', data);
            
            // Also dispatch specific event types if present in the message
            if (data.type) {
                this.dispatchEvent(data.type, data);
            }
        } catch (error) {
            console.error('Error parsing WebSocket message:', error);
        }
    }

    scheduleReconnect() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
        }

        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
            console.log(`Scheduling WebSocket reconnect in ${delay}ms`);
            
            this.reconnectTimeout = setTimeout(() => {
                this.reconnectAttempts++;
                this.connect();
            }, delay);
        } else {
            console.error('Maximum WebSocket reconnect attempts reached');
            this.dispatchEvent('maxReconnectAttemptsReached', {});
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.close(1000, 'User disconnected');
            this.socket = null;
        }
        
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
    }

    send(data) {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            console.error('Cannot send message, WebSocket is not connected');
            return false;
        }

        try {
            const message = typeof data === 'string' ? data : JSON.stringify(data);
            this.socket.send(message);
            return true;
        } catch (error) {
            console.error('Error sending WebSocket message:', error);
            return false;
        }
    }

    addEventListener(eventType, callback) {
        if (!this.eventListeners[eventType]) {
            this.eventListeners[eventType] = [];
        }
        this.eventListeners[eventType].push(callback);
    }

    removeEventListener(eventType, callback) {
        if (!this.eventListeners[eventType]) return;
        
        this.eventListeners[eventType] = this.eventListeners[eventType].filter(
            cb => cb !== callback
        );
    }

    dispatchEvent(eventType, data) {
        if (!this.eventListeners[eventType]) return;
        
        this.eventListeners[eventType].forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error in WebSocket event listener for ${eventType}:`, error);
            }
        });
    }
}

// Singleton instance
const websocketManager = new WebSocketManager();
export default websocketManager;