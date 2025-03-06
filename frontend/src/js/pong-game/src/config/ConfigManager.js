import * as THREE from 'three';
import { config } from './config.js'

export class ConfigManager {
    static defaultConfig = config

    constructor(customConfig = {}) {
        this.config = this.mergeConfig(ConfigManager.defaultConfig, customConfig);
        this.initializeBallDirection();
    }

    mergeConfig(defaultConfig, customConfig) {
        const merged = {};
        for (const key in defaultConfig) {
            if (typeof defaultConfig[key] === 'object' && !Array.isArray(defaultConfig[key]) && !(defaultConfig[key] instanceof THREE.Vector3)) {
                merged[key] = this.mergeConfig(defaultConfig[key], customConfig[key] || {});
            } else {
                merged[key] = customConfig[key] !== undefined ? customConfig[key] : defaultConfig[key];
            }
        }
        return merged;
    }

    initializeBallDirection() {
        this.config.ball.direction = Math.random() > 0.5
            ? new THREE.Vector3(-1, 0, 0) 
            : new THREE.Vector3(1, 0, 0);
    }

    getConfig() {
        return this.config;
    }

    updateConfig(newConfig) {
        this.config = this.mergeConfig(this.config, newConfig);
    }
}