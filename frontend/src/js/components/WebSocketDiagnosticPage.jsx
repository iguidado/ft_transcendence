import React, { useState, useEffect } from 'react';
import websocketDiagnostic from '../utils/websocketDiagnostic';
import { getApiConfigDefault } from '../api/config/apiConfig';
import '../css/WebSocketDiagnosticPage.css';

const WebSocketDiagnosticPage = () => {
    const [diagnosticState, setDiagnosticState] = useState({
        isRunning: false,
        progress: { message: '', completed: 0 },
        results: null,
        summary: null,
        error: null
    });

    const [options, setOptions] = useState({
        timeout: 10000,
        testSecureAndInsecure: true,
        testPaths: true,
        checkNetwork: true
    });

    const handleOptionChange = (e) => {
        const { name, value, type, checked } = e.target;
        setOptions({
            ...options,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value, 10) : value)
        });
    };

    const runDiagnostic = async () => {
        setDiagnosticState({
            isRunning: true,
            progress: { message: 'Starting...', completed: 0 },
            results: null,
            summary: null,
            error: null
        });

        try {
            const progressCallback = (progress) => {
                setDiagnosticState(prev => ({
                    ...prev,
                    progress
                }));
            };

            const results = await websocketDiagnostic.runDiagnostic(options, progressCallback);
            const summary = websocketDiagnostic.getResultSummary();

            setDiagnosticState({
                isRunning: false,
                progress: { message: 'Complete', completed: results.length },
                results,
                summary,
                error: null
            });
        } catch (error) {
            setDiagnosticState({
                isRunning: false,
                progress: { message: 'Failed', completed: 0 },
                results: null,
                summary: null,
                error: error.toString()
            });
        }
    };

    const cancelDiagnostic = () => {
        websocketDiagnostic.cancelDiagnostic();
        setDiagnosticState(prev => ({
            ...prev,
            isRunning: false,
            progress: { ...prev.progress, message: 'Cancelled' }
        }));
    };

    // Get API config information
    const apiConfig = getApiConfigDefault();
    const expectedWsUrl = apiConfig.url.replace(/^http(s?):\/\//, (apiConfig.url.startsWith('https') ? 'wss://' : 'ws://'));

    return (
        <div className="ws-diagnostic-container">
            <h1>WebSocket Diagnostic Tool</h1>
            
            <div className="ws-diagnostic-section">
                <h2>Current Configuration</h2>
                <div className="ws-config-info">
                    <div>
                        <strong>API Base URL:</strong> {apiConfig.url}
                    </div>
                    <div>
                        <strong>Expected WS URL:</strong> {expectedWsUrl}/ws/status/
                    </div>
                </div>
            </div>

            <div className="ws-diagnostic-section">
                <h2>Diagnostic Options</h2>
                <div className="ws-diagnostic-options">
                    <div className="option-group">
                        <label>
                            <input
                                type="checkbox"
                                name="checkNetwork"
                                checked={options.checkNetwork}
                                onChange={handleOptionChange}
                            />
                            Test Network Connectivity
                        </label>
                    </div>

                    <div className="option-group">
                        <label>
                            <input
                                type="checkbox"
                                name="testSecureAndInsecure"
                                checked={options.testSecureAndInsecure}
                                onChange={handleOptionChange}
                            />
                            Test Both HTTP and HTTPS Variants
                        </label>
                    </div>

                    <div className="option-group">
                        <label>
                            <input
                                type="checkbox"
                                name="testPaths"
                                checked={options.testPaths}
                                onChange={handleOptionChange}
                            />
                            Test Multiple WebSocket Paths
                        </label>
                    </div>

                    <div className="option-group">
                        <label>
                            Connection Timeout (ms):
                            <input
                                type="number"
                                name="timeout"
                                value={options.timeout}
                                onChange={handleOptionChange}
                                min="1000"
                                max="30000"
                            />
                        </label>
                    </div>
                </div>

                <div className="ws-diagnostic-actions">
                    <button 
                        onClick={runDiagnostic} 
                        disabled={diagnosticState.isRunning}
                        className="primary-button"
                    >
                        Run Diagnostic
                    </button>
                    <button 
                        onClick={cancelDiagnostic} 
                        disabled={!diagnosticState.isRunning}
                        className="cancel-button"
                    >
                        Cancel
                    </button>
                </div>
            </div>

            {diagnosticState.isRunning && (
                <div className="ws-diagnostic-section">
                    <h2>Running Diagnostic...</h2>
                    <div className="progress-indicator">
                        <div className="progress-message">
                            {diagnosticState.progress.message}
                        </div>
                        <div className="loader"></div>
                    </div>
                </div>
            )}

            {diagnosticState.error && (
                <div className="ws-diagnostic-section error-section">
                    <h2>Diagnostic Error</h2>
                    <div className="error-message">
                        {diagnosticState.error}
                    </div>
                </div>
            )}

            {diagnosticState.summary && (
                <div className="ws-diagnostic-section">
                    <h2>Diagnostic Summary</h2>
                    <div className="summary-container">
                        <div className="summary-item">
                            <span className="summary-label">Total Tests:</span>
                            <span className="summary-value">{diagnosticState.summary.total}</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Successful:</span>
                            <span className="summary-value success-count">{diagnosticState.summary.successful}</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Failed:</span>
                            <span className="summary-value error-count">{diagnosticState.summary.failed}</span>
                        </div>
                        <div className="summary-item">
                            <span className="summary-label">Network Connectivity:</span>
                            <span className={`summary-value ${diagnosticState.summary.networkConnectivity ? 'success' : 'error'}`}>
                                {diagnosticState.summary.networkConnectivity ? 'OK' : 'Issues Detected'}
                            </span>
                        </div>
                    </div>

                    {diagnosticState.summary.bestConnection && (
                        <div className="best-connection">
                            <h3>Best Connection:</h3>
                            <div className="connection-details">
                                <div><strong>URL:</strong> {diagnosticState.summary.bestConnection.url}</div>
                                <div><strong>Connect Time:</strong> {diagnosticState.summary.bestConnection.connectTime}ms</div>
                            </div>
                        </div>
                    )}

                    {diagnosticState.summary.commonErrors && diagnosticState.summary.commonErrors.length > 0 && (
                        <div className="common-errors">
                            <h3>Common Errors:</h3>
                            <ul>
                                {diagnosticState.summary.commonErrors.map((error, idx) => (
                                    <li key={idx}>
                                        <div>{error.error}</div>
                                        <div className="error-count">Occurred {error.count} times</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {diagnosticState.results && (
                <div className="ws-diagnostic-section">
                    <h2>Detailed Test Results</h2>
                    <div className="results-container">
                        {diagnosticState.results.map((result, idx) => {
                            // Check if it's a network test
                            if (result.test === 'network') {
                                return (
                                    <div key={idx} className={`result-item ${result.success ? 'success' : 'error'}`}>
                                        <h3>Network Connectivity Test</h3>
                                        <div className="result-status">
                                            Status: {result.success ? 'Success' : 'Failed'}
                                        </div>
                                        {result.error && (
                                            <div className="result-error">Error: {result.error}</div>
                                        )}
                                        {result.details && (
                                            <div className="result-details">
                                                {result.details.navigatorOnline !== undefined && (
                                                    <div>Navigator Online: {result.details.navigatorOnline ? 'Yes' : 'No'}</div>
                                                )}
                                                {result.details.httpTest && (
                                                    <div>
                                                        <div>HTTP Test: {result.details.httpTest.success ? 'Success' : 'Failed'}</div>
                                                        {result.details.httpTest.status && (
                                                            <div>Status: {result.details.httpTest.status}</div>
                                                        )}
                                                        {result.details.httpTest.time && (
                                                            <div>Response Time: {result.details.httpTest.time}ms</div>
                                                        )}
                                                        {result.details.httpTest.error && (
                                                            <div>Error: {result.details.httpTest.error}</div>
                                                        )}
                                                    </div>
                                                )}
                                                {result.details.pingTest && (
                                                    <div>
                                                        <div>Ping Test: {result.details.pingTest.success ? 'Success' : 'Failed'}</div>
                                                        {result.details.pingTest.time && (
                                                            <div>Ping Time: {result.details.pingTest.time}ms</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            } else {
                                // WebSocket connection test
                                return (
                                    <div key={idx} className={`result-item ${result.success ? 'success' : 'error'}`}>
                                        <h3>WebSocket Connection Test</h3>
                                        <div className="result-url">{result.url}</div>
                                        <div className="result-status">
                                            Status: {result.success ? 'Connected' : 'Failed'}
                                        </div>
                                        {result.connectTime && (
                                            <div className="result-time">Connect Time: {result.connectTime}ms</div>
                                        )}
                                        {result.closeCode && (
                                            <div className="result-code">Close Code: {result.closeCode}</div>
                                        )}
                                        {result.closeReason && (
                                            <div className="result-reason">Close Reason: {result.closeReason}</div>
                                        )}
                                        {result.error && (
                                            <div className="result-error">Error: {result.error}</div>
                                        )}
                                    </div>
                                );
                            }
                        })}
                    </div>
                </div>
            )}

            <div className="ws-diagnostic-section">
                <h2>Troubleshooting Tips</h2>
                <div className="troubleshooting-tips">
                    <h3>Common WebSocket Issues:</h3>
                    <ul>
                        <li>
                            <strong>Code 1006 (Abnormal Closure):</strong> This often indicates network connectivity issues, 
                            server unavailability, or firewall/proxy blocking WebSocket connections.
                        </li>
                        <li>
                            <strong>CORS Issues:</strong> Make sure the WebSocket server has proper CORS configuration if 
                            connecting from a different origin.
                        </li>
                        <li>
                            <strong>SSL/TLS Issues:</strong> When using secure WebSockets (WSS), ensure certificates are valid 
                            and trusted by the browser.
                        </li>
                        <li>
                            <strong>Path Issues:</strong> Ensure the WebSocket endpoint path is correct and the server is 
                            properly configured to handle WebSocket connections at that path.
                        </li>
                        <li>
                            <strong>Firewall or Proxy Blocking:</strong> Corporate networks often block WebSocket connections. 
                            Check with your network administrator.
                        </li>
                    </ul>

                    <h3>Next Steps:</h3>
                    <ul>
                        <li>Check if the WebSocket server is running</li>
                        <li>Verify the WebSocket URL is correct (protocol, host, path)</li>
                        <li>Check browser console for additional error messages</li>
                        <li>Test on a different network or device</li>
                        <li>Check server logs for connection attempts</li>
                        <li>Ensure server is configured to accept WebSocket connections</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default WebSocketDiagnosticPage;