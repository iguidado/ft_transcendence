import { configSchema } from './config.js';
import { ConfigUI } from './ConfigUI.js';

// Initialize the configuration UI and let it handle game initialization
const configUI = new ConfigUI(
  configSchema,                   // Config schema
  'inputs',                       // UI container ID
  null,                           // Game context (null because we'll initialize it)
  'game-container'                // Game container ID
);

// Generate the UI
configUI.generate();
