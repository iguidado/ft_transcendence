import { Game } from '../pong-game/src/core/Game.js';
import { gameRegistry } from '../pong-game/src/core/GameRegistry.js';

export class ConfigUI {
  constructor(schema, containerId, gameContext = null, gameContainer = null) {
    this.schema = schema;
    this.container = document.getElementById(containerId);
    this.gameContext = gameContext;
    this.gameContainer = gameContainer ? 
      (typeof gameContainer === 'string' ? document.getElementById(gameContainer) : gameContainer) : 
      null;
    this.controls = {};
    
    // Initialize game if context not provided but container is
    if (!this.gameContext && this.gameContainer) {
      const game = this.initializeGame(this.gameContainer);
      if (game) {
        this.gameContext = gameRegistry.getCurrentContext();
      }
    }
  }

  generate() {
    // Clear container first
    this.container.innerHTML = '<h3>Pong 3D Configuration</h3>';
    
    // Create columns container
    const columnsContainer = document.createElement('div');
    columnsContainer.className = 'controls-container';
    this.container.appendChild(columnsContainer);
    
    // Create columns (3 columns layout)
    const columns = [];
    for (let i = 0; i < 3; i++) {
      const column = document.createElement('div');
      column.className = 'controls-column';
      columnsContainer.appendChild(column);
      columns.push(column);
    }
    
    // Distribute sections across columns
    this.schema.forEach((section, index) => {
      const columnIndex = index % columns.length;
      const sectionElement = this.createSection(section);
      columns[columnIndex].appendChild(sectionElement);
    });
    
    // Add presets and buttons section
    this.createPresetsSection();
  }
  
  createSection(section) {
    const sectionElement = document.createElement('div');
    sectionElement.className = 'slider-section';
    
    const heading = document.createElement('h4');
    heading.textContent = section.section;
    sectionElement.appendChild(heading);
    
    section.controls.forEach(control => {
      const controlElement = this.createControl(control);
      sectionElement.appendChild(controlElement);
      this.controls[control.id] = control;
    });
    
    return sectionElement;
  }
  
  createControl(control) {
    const row = document.createElement('div');
    row.className = 'slider-row';
    
    // Create label
    const label = document.createElement('label');
    label.setAttribute('for', control.id);
    label.textContent = control.label;
    row.appendChild(label);
    
    // Create input based on type
    if (control.type === 'slider') {
      const input = document.createElement('input');
      input.type = 'range';
      input.id = control.id;
      input.min = control.min;
      input.max = control.max;
      input.step = control.step;
      input.value = this.getConfigValue(control.path) || control.default;
      row.appendChild(input);
      
      // Add value display
      const valueSpan = document.createElement('span');
      valueSpan.className = 'value';
      valueSpan.id = `${control.id}Value`;
      valueSpan.textContent = parseFloat(input.value).toFixed(control.decimals || 0);
      row.appendChild(valueSpan);
      
      // Add event listener
      input.addEventListener('input', (e) => {
        const value = parseFloat(e.target.value);
        valueSpan.textContent = value.toFixed(control.decimals || 0);
        
        // Update config
        this.updateConfigValue(control.path, value);
        
        // Execute callback if exists
        if (control.callback) {
          control.callback(value, this.gameContext);
        }
        
        // Handle camera updates differently
        if (control.path.startsWith('camera.polar')) {
          this.updateCamera(control.path.split('.').pop(), value);
        }
        
        // Update dependent controls
        if (control.affects) {
          control.affects.forEach(affectedId => {
            const affected = document.getElementById(affectedId);
            if (affected) {
              const affectedControl = this.controls[affectedId];
              if (affectedControl.dependsOn && 
                  affectedControl.dependsOn.control === control.id) {
                affected.disabled = value === affectedControl.dependsOn.value;
              }
            }
          });
        }
      });
      
    } else if (control.type === 'checkbox') {
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.id = control.id;
      input.checked = this.getConfigValue(control.path) ?? control.default;
      row.appendChild(input);
      
      // Add event listener
      input.addEventListener('change', (e) => {
        const value = e.target.checked;
        
        // Update config
        this.updateConfigValue(control.path, value);
        
        // Execute callback if exists
        if (control.callback) {
          control.callback(value, this.gameContext);
        }
        
        // Handle camera updates
        if (control.path.startsWith('camera.polar')) {
          this.updateCamera(control.path.split('.').pop(), value);
        }
        
        // Update dependent controls
        if (control.affects) {
          control.affects.forEach(affectedId => {
            const affected = document.getElementById(affectedId);
            if (affected) {
              affected.disabled = value;
            }
          });
        }
      });
    }
    
    return row;
  }
  
  createPresetsSection() {
    const presetSection = document.createElement('div');
    presetSection.className = 'preset-section';
    this.container.appendChild(presetSection);
    
    // Camera presets heading
    const presetHeading = document.createElement('h4');
    presetHeading.textContent = 'Camera Presets';
    presetSection.appendChild(presetHeading);
    
    // Preset buttons row
    const presetRow = document.createElement('div');
    presetRow.className = 'button-row';
    presetSection.appendChild(presetRow);
    
    // Define presets
    const presets = [
      {
        id: 'presetTopDown',
        label: 'Top Down',
        values: {
          phi: -1.5, theta: 0, rotateX: 0, rotateY: 0, rotateZ: 0,
          useCalculatedRadius: true, calculatedRadiusMargin: 1.2
        }
      },
      {
        id: 'presetPlayerView',
        label: 'Player View',
        values: {
          phi: -0.1, theta: 0, rotateX: 0, rotateY: 0, rotateZ: 0,
          useCalculatedRadius: false, radius: 15
        }
      },
      {
        id: 'presetSideView',
        label: 'Side View',
        values: {
          phi: 0, theta: 1.57, rotateX: 0, rotateY: 0, rotateZ: 0,
          useCalculatedRadius: true, calculatedRadiusMargin: 1.0
        }
      },
      {
        id: 'presetIsometricView',
        label: 'Isometric',
        values: {
          phi: -0.6, theta: 0.7, rotateX: 0, rotateY: 0, rotateZ: 0,
          useCalculatedRadius: true, calculatedRadiusMargin: 1.2
        }
      },
      {
        id: 'presetCornerView',
        label: 'Corner View',
        values: {
          phi: -0.3, theta: 2.5, rotateX: 0, rotateY: 0, rotateZ: 0,
          useCalculatedRadius: true, calculatedRadiusMargin: 1.0
        }
      }
    ];
    
    // Create preset buttons
    presets.forEach(preset => {
      const button = document.createElement('button');
      button.id = preset.id;
      button.className = 'preset-btn';
      button.textContent = preset.label;
      presetRow.appendChild(button);
      
      button.addEventListener('click', () => {
        this.applyPreset(preset.values);
      });
    });
    
    // Game controls heading
    const gameControlsHeading = document.createElement('h4');
    gameControlsHeading.textContent = 'Game Controls';
    presetSection.appendChild(gameControlsHeading);
    
    // Game controls row
    const gameControlsRow = document.createElement('div');
    gameControlsRow.className = 'button-row';
    presetSection.appendChild(gameControlsRow);
    
    // Save config button
    const saveButton = document.createElement('button');
    saveButton.id = 'saveConfig';
    saveButton.textContent = 'Save Configuration';
    gameControlsRow.appendChild(saveButton);
    
    saveButton.addEventListener('click', () => {
      this.saveConfig();
    });
    
    // Reset game button
    const resetButton = document.createElement('button');
    resetButton.id = 'resetGame';
    resetButton.className = 'game-control-btn';
    resetButton.textContent = 'Reinitialize Game';
    gameControlsRow.appendChild(resetButton);
    
    resetButton.addEventListener('click', () => {
        this.reinitializeGame();
    });
    
    // Toggle pause button
    const pauseButton = document.createElement('button');
    pauseButton.id = 'togglePause';
    pauseButton.className = 'game-control-btn';
    pauseButton.textContent = 'Pause';
    gameControlsRow.appendChild(pauseButton);
    
    pauseButton.addEventListener('click', () => {
      if (this.gameContext.game.isRunning) {
        this.gameContext.game.stop();
        pauseButton.textContent = 'Resume';
      } else {
        this.gameContext.game.start();
        pauseButton.textContent = 'Pause';
      }
    });

    // Apply config button
    const applyButton = document.createElement('button');
    applyButton.id = 'applyConfig';
    applyButton.className = 'game-control-btn';
    applyButton.textContent = 'Apply Configuration';
    gameControlsRow.appendChild(applyButton);

    applyButton.addEventListener('click', () => {
        this.reinitializeGame();
    });
  }
  
  getConfigValue(path) {
    const parts = path.split('.');
    let current = this.gameContext.config;
    
    for (const part of parts) {
      if (current === undefined || current === null) return undefined;
      current = current[part];
    }
    
    return current;
  }
  
  updateConfigValue(path, value) {
    const parts = path.split('.');
    let current = this.gameContext.config;
    
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
  
  updateCamera(param, value) {
    this.gameContext.config.camera.polar[param] = value;
    
    // Reinitialize all camera views
    this.gameContext.viewManager.views.forEach(view => {
      view.cameraManager.init();
    });
  }
  
  applyPreset(values) {
    Object.entries(values).forEach(([key, value]) => {
      // Update camera config
      this.updateCamera(key, value);
      
      // Update UI
      if (key === 'useCalculatedRadius') {
        const checkbox = document.getElementById(key);
        if (checkbox) {
          checkbox.checked = value;
          document.getElementById('manualRadius').disabled = value;
        }
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
  
  saveConfig() {
    const config = this.gameContext.config;
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
  }

  reinitializeGame() {
    if (!this.gameContext || !this.gameContext.game) {
      console.error('No game context available for reinitialization');
      return;
    }
    
    // Get current configuration
    const currentConfig = JSON.parse(JSON.stringify(this.gameContext.config));
    
    // Get container reference
    const container = this.gameContext.game.container;
    
    // Stop and clean up current game
    this.gameContext.game.stop();
    this.gameContext.game.cleanup();
    
    // Create and initialize a new game instance with current config
    this.initializeGame(container, currentConfig);
  }

  initializeGame(container, config = {}) {
	delete config.camera;
	console.log(config)
    // Create new game instance
    const game = new Game(container, config);
    
    // Start the game
    game.start();
    
    // Get the current game context (newly created)
    const gameContext = gameRegistry.getCurrentContext();
    
    // Update our reference to the current context
    this.gameContext = gameContext;
    
    // Add game reference to context
    this.gameContext.game = game;
    
    console.log('Game reinitialized with current configuration');
    return game;
  }
}