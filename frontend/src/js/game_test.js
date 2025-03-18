import { gameRegistry } from './pong-game/src/core/GameRegistry.js';
import { Game } from './pong-game/src/core/Game.js';

// Get container and create game
const container = document.getElementById("game-container");
const game = new Game(container);

// Start the game
game.start();

setTimeout(() => {
    try {
        // Get the current game context
        const gameContext = gameRegistry.getCurrentContext();
        if (!gameContext) {
            console.error('Game context not found');
            return;
        }
        
        // Initialize slider values from current config
        function initSliders() {
            const config = gameContext.config;
            const cameraConfig = config.camera.polar;
            
            // Camera rotation controls
            updateSliderValue('rotateX', cameraConfig.rotateX, 2);
            updateSliderValue('rotateY', cameraConfig.rotateY, 2);
            updateSliderValue('rotateZ', cameraConfig.rotateZ, 2);
            
            // Polar coordinates
            updateSliderValue('phi', cameraConfig.phi, 2);
            updateSliderValue('theta', cameraConfig.theta, 2);
            
            // Radius settings
            document.getElementById('useCalculatedRadius').checked = cameraConfig.useCalculatedRadius;
            document.getElementById('manualRadius').disabled = cameraConfig.useCalculatedRadius;
            updateSliderValue('calculatedRadiusMargin', cameraConfig.calculatedRadiusMargin, 1);
            updateSliderValue('manualRadius', cameraConfig.radius || 92, 0);
            
            // Game parameters
            updateSliderValue('ballSpeed', config.ball.speed, 1);
            updateSliderValue('paddleSpeed', config.paddles.speed, 1);
            updateSliderValue('ballSize', config.ball.size || 1, 1);
            
            // Board setup
            updateSliderValue('boardWidth', config.board.width, 0);
            updateSliderValue('boardHeight', config.board.height, 0);
            updateSliderValue('wallHeight', config.board.wallHeight, 1);
            
            // Bot AI settings
            if (config.paddles && config.paddles.controls && config.paddles.controls.bots) {
                updateSliderValue('botDifficulty', config.paddles.controls.bots.difficulty || 0.5, 2);
                updateSliderValue('botPredictionError', config.paddles.controls.bots.predictionError || 0.1, 2);
                updateSliderValue('botReactionTime', config.paddles.controls.bots.reactionTime || 100, 0);
            }
            
            // Visual settings
            updateSliderValue('boardOpacity', config.board.opacity || 1, 2);
            updateSliderValue('wallOpacity', config.board.wallOpacity || 1, 2);
            updateSliderValue('lightIntensity', config.lighting?.intensity || 1, 1);
            
            // Physics settings
            updateSliderValue('bounceIntensity', config.physics?.bounceIntensity || 1, 2);
            updateSliderValue('paddleImpactEffect', config.physics?.paddleImpactEffect || 1, 2);
            updateSliderValue('spinEffect', config.physics?.spinEffect || 0.1, 2);
            
            // Paddle settings
            updateSliderValue('paddleHeight', config.paddles.height || 7, 1);
            updateSliderValue('paddleWidth', config.paddles.width || 1, 1);
        }
        
        // Helper to update slider and its display value
        function updateSliderValue(id, value, decimals = 2) {
            const element = document.getElementById(id);
            const valueElement = document.getElementById(`${id}Value`);
            
            if (element && valueElement) {
                element.value = value;
                valueElement.textContent = value.toFixed(decimals);
            }
        }
        
        // Update camera when sliders change
        function setupEventListeners() {
            // Camera rotation sliders
            bindSliderToCamera('rotateX');
            bindSliderToCamera('rotateY');
            bindSliderToCamera('rotateZ');
            
            // Polar coordinate sliders
            bindSliderToCamera('phi');
            bindSliderToCamera('theta');
            
            // Radius controls
            document.getElementById('useCalculatedRadius').addEventListener('change', (e) => {
                const useCalculated = e.target.checked;
                document.getElementById('manualRadius').disabled = useCalculated;
                updateCamera('useCalculatedRadius', useCalculated);
            });
            
            bindSliderToCamera('calculatedRadiusMargin', null, 1);
            bindSliderToCamera('manualRadius', 'radius', 0);
            
            // Game parameters
            bindSliderToConfig('ballSpeed', 'ball.speed', 1);
            bindSliderToConfig('paddleSpeed', 'paddles.speed', 1);
            bindSliderToConfig('ballSize', 'ball.size', 1, () => {
                // Update the ball size in the scene
                if (gameContext.boardManager && gameContext.boardManager.ball) {
                    const size = parseFloat(document.getElementById('ballSize').value);
                    gameContext.boardManager.ball.setSize(size);
                }
            });
            
            // Board setup - these require a game restart to take effect
            bindSliderToConfig('boardWidth', 'board.width', 0);
            bindSliderToConfig('boardHeight', 'board.height', 0);
            bindSliderToConfig('wallHeight', 'board.wallHeight', 1);
            
            // Bot AI settings
            bindSliderToConfig('botDifficulty', 'paddles.controls.bots.difficulty', 2);
            bindSliderToConfig('botPredictionError', 'paddles.controls.bots.predictionError', 2);
            bindSliderToConfig('botReactionTime', 'paddles.controls.bots.reactionTime', 0);
            
            // Visual settings
            bindSliderToConfig('boardOpacity', 'board.opacity', 2, () => {
                updateBoardMaterials('floor', parseFloat(document.getElementById('boardOpacity').value));
            });
            
            bindSliderToConfig('wallOpacity', 'board.wallOpacity', 2, () => {
                updateBoardMaterials('walls', parseFloat(document.getElementById('wallOpacity').value));
            });
            
            bindSliderToConfig('lightIntensity', 'lighting.intensity', 1, () => {
                updateLighting(parseFloat(document.getElementById('lightIntensity').value));
            });
            
            // Physics settings
            bindSliderToConfig('bounceIntensity', 'physics.bounceIntensity', 2);
            bindSliderToConfig('paddleImpactEffect', 'physics.paddleImpactEffect', 2);
            bindSliderToConfig('spinEffect', 'physics.spinEffect', 2);
            
            // Paddle settings
            bindSliderToConfig('paddleHeight', 'paddles.height', 1, () => {
                updatePaddleDimensions();
            });
            
            bindSliderToConfig('paddleWidth', 'paddles.width', 1, () => {
                updatePaddleDimensions();
            });
            
            // Save configuration
            document.getElementById('saveConfig').addEventListener('click', () => {
                const config = gameContext.config;
                console.log('Full configuration:', JSON.stringify(config, null, 2));
                
                // Create a downloadable config file
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
                const downloadAnchorNode = document.createElement('a');
                downloadAnchorNode.setAttribute("href", dataStr);
                downloadAnchorNode.setAttribute("download", "pong3d_config.json");
                document.body.appendChild(downloadAnchorNode);
                downloadAnchorNode.click();
                downloadAnchorNode.remove();
                
                alert('Configuration saved and downloaded');
            });
            
            // Reset game button
            document.getElementById('resetGame').addEventListener('click', () => {
                // This would typically reinitialize the game with current settings
                if (confirm('Reset the game with current settings?')) {
                    gameContext.boardManager.resetGame();
                }
            });
            
            // Toggle pause button
            document.getElementById('togglePause').addEventListener('click', () => {
                if (game.isRunning) {
                    game.stop();
                    document.getElementById('togglePause').textContent = 'Resume';
                } else {
                    game.start();
                    document.getElementById('togglePause').textContent = 'Pause';
                }
            });
            
            // Camera preset buttons
            setupCameraPresets();
        }
        
        // Helper function to bind a slider to a camera parameter
        function bindSliderToCamera(id, paramOverride = null, decimals = 2) {
            document.getElementById(id).addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                document.getElementById(`${id}Value`).textContent = value.toFixed(decimals);
                updateCamera(paramOverride || id, value);
            });
        }
        
        // Helper function to bind a slider to any config parameter
        function bindSliderToConfig(id, configPath, decimals = 2, callback = null) {
            document.getElementById(id).addEventListener('input', (e) => {
                const value = parseFloat(e.target.value);
                document.getElementById(`${id}Value`).textContent = value.toFixed(decimals);
                
                // Update the configuration value using the path
                updateConfigValue(gameContext.config, configPath, value);
                
                // If a callback is provided, execute it
                if (callback) callback();
            });
        }
        
        // Helper to update a deeply nested config value using a dot-notation path
        function updateConfigValue(obj, path, value) {
            const parts = path.split('.');
            let current = obj;
            
            // Navigate to the nested property
            for (let i = 0; i < parts.length - 1; i++) {
                // Create the object if it doesn't exist
                if (!current[parts[i]]) {
                    current[parts[i]] = {};
                }
                current = current[parts[i]];
            }
            
            // Set the value
            current[parts[parts.length - 1]] = value;
        }
        
        // Update camera parameters and reinitialize all views
        function updateCamera(param, value) {
            const config = gameContext.config;
            config.camera.polar[param] = value;
            
            // Reinitialize all camera views
            gameContext.viewManager.views.forEach(view => {
                view.cameraManager.init();
            });
        }
        
        // Update opacity for board materials
        function updateBoardMaterials(type, opacity) {
            if (!gameContext.boardManager || !gameContext.boardManager.board) return;
            
            const board = gameContext.boardManager.board;
            
            if (type === 'floor' && board.floor) {
                board.floor.material.opacity = opacity;
                board.floor.material.transparent = opacity < 1;
                board.floor.material.needsUpdate = true;
            } else if (type === 'walls' && board.walls) {
                board.walls.forEach(wall => {
                    if (wall.material) {
                        wall.material.opacity = opacity;
                        wall.material.transparent = opacity < 1;
                        wall.material.needsUpdate = true;
                    }
                });
            }
        }
        
        // Update lighting intensity
        function updateLighting(intensity) {
            if (!gameContext.scene) return;
            
            gameContext.scene.traverse((object) => {
                if (object.isLight) {
                    object.intensity = intensity;
                }
            });
        }
        
        // Update paddle dimensions
        function updatePaddleDimensions() {
            if (!gameContext.boardManager) return;
            
            const height = parseFloat(document.getElementById('paddleHeight').value);
            const width = parseFloat(document.getElementById('paddleWidth').value);
            
            // Update both paddles with new dimensions
            const { paddleLeft, paddleRight } = gameContext.boardManager;
            
            if (paddleLeft && paddleLeft.mesh) {
                paddleLeft.setDimensions(width, height);
            }
            
            if (paddleRight && paddleRight.mesh) {
                paddleRight.setDimensions(width, height);
            }
        }
        
        // Set up camera preset buttons
        function setupCameraPresets() {
            // Top-down view
            document.getElementById('presetTopDown').addEventListener('click', () => {
                const preset = {
                    phi: -1.5,
                    theta: 0,
                    rotateX: 0,
                    rotateY: 0,
                    rotateZ: 0,
                    useCalculatedRadius: true,
                    calculatedRadiusMargin: 1.2
                };
                applyPreset(preset);
            });
            
            // Player view (from behind one paddle)
            document.getElementById('presetPlayerView').addEventListener('click', () => {
                const preset = {
                    phi: -0.1,
                    theta: 0,
                    rotateX: 0,
                    rotateY: 0,
                    rotateZ: 0,
                    useCalculatedRadius: false,
                    radius: 15
                };
                applyPreset(preset);
            });
            
            // Side view
            document.getElementById('presetSideView').addEventListener('click', () => {
                const preset = {
                    phi: 0,
                    theta: 1.57,
                    rotateX: 0,
                    rotateY: 0,
                    rotateZ: 0,
                    useCalculatedRadius: true,
                    calculatedRadiusMargin: 1.0
                };
                applyPreset(preset);
            });
            
            // Isometric view
            document.getElementById('presetIsometricView').addEventListener('click', () => {
                const preset = {
                    phi: -0.6,
                    theta: 0.7,
                    rotateX: 0,
                    rotateY: 0,
                    rotateZ: 0,
                    useCalculatedRadius: true,
                    calculatedRadiusMargin: 1.2
                };
                applyPreset(preset);
            });
            
            // Corner view
            document.getElementById('presetCornerView').addEventListener('click', () => {
                const preset = {
                    phi: -0.3,
                    theta: 2.5,
                    rotateX: 0,
                    rotateY: 0,
                    rotateZ: 0,
                    useCalculatedRadius: true,
                    calculatedRadiusMargin: 1.0
                };
                applyPreset(preset);
            });
        }
        
        // Apply a camera preset
        function applyPreset(preset) {
            // Apply each preset value to camera config and update UI
            Object.entries(preset).forEach(([key, value]) => {
                updateCamera(key, value);
                
                // Update UI
                if (key === 'useCalculatedRadius') {
                    document.getElementById(key).checked = value;
                    document.getElementById('manualRadius').disabled = value;
                } else {
                    const element = document.getElementById(key);
                    const valueElement = document.getElementById(`${key}Value`);
                    
                    if (element && valueElement) {
                        element.value = value;
                        valueElement.textContent = typeof value === 'number' && Math.abs(value) < 10 ? 
                            value.toFixed(2) : Math.round(value);
                    }
                }
            });
        }
        
        // Initialize the UI
        initSliders();
        setupEventListeners();
        
    } catch (error) {
        console.error('Error initializing configuration controls:', error);
    }
}, 1000); // Give the game time to initialize