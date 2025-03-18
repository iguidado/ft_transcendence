import * as THREE from "three"
import { defaultConfig } from "./preset/defaultConfig.js"
import { initBallDirection } from "./initBallDirection.js"

export function mergeConfig(config1, config2) {
    const merged = {}
    for (const key in config1) {
        if (typeof config1[key] === 'object' && !Array.isArray(config1[key]) && !(config1[key] instanceof THREE.Vector3)) {
            merged[key] = mergeConfig(config1[key], config2?.[key] || {})
        } else {
            merged[key] = config2?.[key] !== undefined ? config2[key] : config1[key]
        }
    }
    for (const key in config2) {
        if (!(key in merged)) {
            merged[key] = config2[key]
        }
    }
    return merged
}

export function initConfig(customConfig) {
	const merged = mergeConfig(defaultConfig, customConfig)
	initBallDirection(merged)
	return merged
}