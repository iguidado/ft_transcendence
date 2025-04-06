import { getApiConfigDefault } from "../api/config/apiConfig";

/**
 * WebSocket Diagnostic Utility
 * Used to test and diagnose WebSocket connection issues
 */
class WebSocketDiagnostic {
    constructor() {
        this.results = [];
        this.isRunning = false;
        this.socket = null;
        this.currentTest = null;
        this.timeout = null;
    }

    /**
     * Run a comprehensive diagnostic on WebSocket connections
     * @param {Object} options - Test options
     * @param {Function} progressCallback - Callback for progress updates
     * @returns {Promise} - Promise resolving to diagnostic results
     */
    runDiagnostic(options = {}, progressCallback = null) {
        if (this.isRunning) {
            return Promise.reject("Diagnostic already running");
        }

        this.isRunning = true;
        this.results = [];
        const defaultOptions = {
            timeout: 10000, // 10 seconds timeout for each test
            testSecureAndInsecure: true,
            testPaths: true,
            checkNetwork: true
        };

        const config = { ...defaultOptions, ...options };
        
        return new Promise((resolve, reject) => {
            this.log("Starting WebSocket diagnostic");
            
            this.runTests(config, progressCallback)
                .then(results => {
                    this.isRunning = false;
                    this.log("Diagnostic complete", results);
                    resolve(results);
                })
                .catch(error => {
                    this.isRunning = false;
                    this.log("Diagnostic failed", error);
                    reject(error);
                });
        });
    }

    /**
     * Run the actual diagnostic tests
     */
    async runTests(config, progressCallback) {
        // 1. Network check
        if (config.checkNetwork) {
            this.updateProgress("Testing network connectivity", progressCallback);
            await this.testNetworkConnectivity();
        }

        // 2. Get API config and test websocket connections
        const apiConfig = getApiConfigDefault();
        
        // Base URL tests with different protocols
        const baseUrls = [apiConfig.url];
        if (config.testSecureAndInsecure) {
            // Add secure/insecure variants
            if (apiConfig.url.startsWith('https://')) {
                baseUrls.push(apiConfig.url.replace('https://', 'http://'));
            } else if (apiConfig.url.startsWith('http://')) {
                baseUrls.push(apiConfig.url.replace('http://', 'https://'));
            }
        }

        // Test paths
        const paths = ['/ws/status/'];
        if (config.testPaths) {
            paths.push('/ws/', '/websocket/', '/socket/');
        }

        // Run tests for each URL and path combination
        for (const baseUrl of baseUrls) {
            for (const path of paths) {
                // Convert http/https to ws/wss
                const wsProtocol = baseUrl.startsWith('https') ? 'wss' : 'ws';
                const wsBaseUrl = baseUrl.replace(/^http(s?):\/\//, `${wsProtocol}://`);
                const socketUrl = `${wsBaseUrl}${path.startsWith('/') ? path.substring(1) : path}`;
                
                this.updateProgress(`Testing WebSocket connection to ${socketUrl}`, progressCallback);
                await this.testConnection(socketUrl, config.timeout);
            }
        }

        return this.results;
    }

    /**
     * Test a single WebSocket connection
     * @param {string} url - The WebSocket URL to test
     * @param {number} timeout - Connection timeout in milliseconds
     */
    testConnection(url, timeout) {
        return new Promise((resolve) => {
            this.log(`Testing connection to ${url}`);
            
            const result = {
                url,
                success: false,
                error: null,
                connectTime: null,
                closeCode: null,
                closeReason: null
            };
            
            const startTime = Date.now();
            
            try {
                const socket = new WebSocket(url);
                this.currentTest = { socket, result };
                
                // Set connection timeout
                this.timeout = setTimeout(() => {
                    this.log(`Connection to ${url} timed out after ${timeout}ms`);
                    result.error = "Connection timeout";
                    
                    if (socket.readyState !== WebSocket.CLOSED) {
                        socket.close();
                    }
                    
                    this.results.push(result);
                    this.currentTest = null;
                    resolve(result);
                }, timeout);
                
                // Connection opened successfully
                socket.onopen = () => {
                    const connectTime = Date.now() - startTime;
                    this.log(`Connected to ${url} in ${connectTime}ms`);
                    
                    result.success = true;
                    result.connectTime = connectTime;
                    
                    clearTimeout(this.timeout);
                    this.timeout = null;
                    
                    // Close the connection after successful test
                    setTimeout(() => {
                        if (socket.readyState === WebSocket.OPEN) {
                            socket.close(1000, "Diagnostic test complete");
                        }
                    }, 1000);
                };
                
                // Handle errors
                socket.onerror = (event) => {
                    this.log(`Error connecting to ${url}`, event);
                    result.error = JSON.stringify(event);
                };
                
                // Connection closed
                socket.onclose = (event) => {
                    this.log(`Connection to ${url} closed: code=${event.code}, reason=${event.reason || 'No reason provided'}`);
                    
                    result.closeCode = event.code;
                    result.closeReason = event.reason || 'No reason provided';
                    
                    if (this.timeout) {
                        clearTimeout(this.timeout);
                        this.timeout = null;
                    }
                    
                    this.results.push(result);
                    this.currentTest = null;
                    resolve(result);
                };
            } catch (error) {
                this.log(`Exception testing ${url}`, error);
                
                result.error = error.message || "Unknown error";
                this.results.push(result);
                
                if (this.timeout) {
                    clearTimeout(this.timeout);
                    this.timeout = null;
                }
                
                this.currentTest = null;
                resolve(result);
            }
        });
    }

    /**
     * Test basic network connectivity
     */
    async testNetworkConnectivity() {
        this.log("Testing network connectivity");
        
        const result = {
            test: "network",
            success: false,
            error: null,
            details: {}
        };
        
        try {
            // Test if navigator.onLine is available and true
            if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
                result.details.navigatorOnline = navigator.onLine;
                this.log(`Navigator online status: ${navigator.onLine}`);
            }
            
            // Try to fetch a small resource from the API host
            try {
                const apiConfig = getApiConfigDefault();
                const url = `${apiConfig.url}/ping`;
                
                this.log(`Testing HTTP connectivity to ${url}`);
                const startTime = Date.now();
                const response = await fetch(url, { 
                    method: 'GET',
                    headers: { 'Cache-Control': 'no-cache' },
                    mode: 'cors'
                });
                
                const elapsed = Date.now() - startTime;
                const status = response.status;
                
                result.details.httpTest = {
                    url,
                    success: status >= 200 && status < 300,
                    status,
                    time: elapsed
                };
                
                this.log(`HTTP test result: status=${status}, time=${elapsed}ms`);
            } catch (httpError) {
                this.log("HTTP connectivity test failed", httpError);
                result.details.httpTest = {
                    success: false,
                    error: httpError.message || "Unknown error"
                };
            }
            
            // Ping test via image loading (alternative network test)
            try {
                this.log("Running ping test via image loading");
                const pingResult = await this.pingTest();
                result.details.pingTest = pingResult;
            } catch (pingError) {
                this.log("Ping test failed", pingError);
                result.details.pingTest = {
                    success: false,
                    error: pingError.message || "Unknown error"
                };
            }
            
            // Update overall success status
            result.success = 
                (result.details.httpTest && result.details.httpTest.success) || 
                (result.details.pingTest && result.details.pingTest.success) ||
                (result.details.navigatorOnline === true);
            
        } catch (error) {
            this.log("Network connectivity test failed", error);
            result.error = error.message || "Unknown error";
        }
        
        this.results.push(result);
        return result;
    }

    /**
     * Simple ping test via image loading with timeout
     */
    pingTest(timeout = 5000) {
        return new Promise((resolve) => {
            const pingUrls = [
                "https://www.google.com/favicon.ico", 
                "https://www.cloudflare.com/favicon.ico"
            ];
            
            let loaded = false;
            const result = {
                success: false,
                time: null,
                details: {}
            };
            
            // Try each URL
            pingUrls.forEach(url => {
                const img = new Image();
                const startTime = Date.now();
                
                img.onload = () => {
                    if (loaded) return;
                    loaded = true;
                    
                    const pingTime = Date.now() - startTime;
                    result.success = true;
                    result.time = pingTime;
                    result.details[url] = { success: true, time: pingTime };
                    
                    this.log(`Ping successful: ${url} (${pingTime}ms)`);
                    resolve(result);
                };
                
                img.onerror = () => {
                    result.details[url] = { success: false };
                    this.log(`Ping failed: ${url}`);
                    
                    // Only resolve if all have failed
                    if (Object.keys(result.details).length === pingUrls.length && !loaded) {
                        resolve(result);
                    }
                };
                
                img.src = `${url}?t=${Date.now()}`;
            });
            
            // Set overall timeout
            setTimeout(() => {
                if (!loaded && Object.keys(result.details).length < pingUrls.length) {
                    this.log("Ping test timed out");
                    resolve(result);
                }
            }, timeout);
        });
    }

    /**
     * Cancel any running diagnostic
     */
    cancelDiagnostic() {
        if (!this.isRunning) return;
        
        this.log("Canceling diagnostic");
        
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        
        if (this.currentTest && this.currentTest.socket) {
            if (this.currentTest.socket.readyState !== WebSocket.CLOSED) {
                this.currentTest.socket.close();
            }
            this.currentTest = null;
        }
        
        this.isRunning = false;
    }

    /**
     * Log diagnostic messages
     */
    log(message, data) {
        console.log(`[WebSocketDiagnostic] ${message}`, data !== undefined ? data : '');
    }

    /**
     * Update progress callback if provided
     */
    updateProgress(message, callback) {
        if (typeof callback === 'function') {
            callback({
                message,
                completed: this.results.length,
                isRunning: this.isRunning
            });
        }
    }

    /**
     * Get test results
     */
    getResults() {
        return [...this.results];
    }

    /**
     * Get a summary of the diagnostic results
     */
    getResultSummary() {
        const successfulConnections = this.results.filter(r => r.success);
        const failedConnections = this.results.filter(r => !r.success);
        
        return {
            total: this.results.length,
            successful: successfulConnections.length,
            failed: failedConnections.length,
            networkConnectivity: this.results.find(r => r.test === 'network')?.success || false,
            bestConnection: successfulConnections.length > 0
                ? successfulConnections.reduce((prev, current) => 
                    (current.connectTime && (!prev.connectTime || current.connectTime < prev.connectTime)) 
                        ? current : prev, successfulConnections[0])
                : null,
            commonErrors: this.getCommonErrors()
        };
    }

    /**
     * Analyze common errors in the results
     */
    getCommonErrors() {
        const errors = this.results
            .filter(r => !r.success && r.error)
            .map(r => r.error);
        
        // Find the most common error messages
        const errorCounts = {};
        errors.forEach(error => {
            errorCounts[error] = (errorCounts[error] || 0) + 1;
        });
        
        return Object.entries(errorCounts)
            .map(([error, count]) => ({ error, count }))
            .sort((a, b) => b.count - a.count);
    }
}

// Create a singleton instance
const websocketDiagnostic = new WebSocketDiagnostic();
export default websocketDiagnostic;