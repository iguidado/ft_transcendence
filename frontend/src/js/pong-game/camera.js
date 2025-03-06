import * as THREE from 'three';
import { config } from './src/utils/config.js';

export const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )

camera.position.z = config.camera.z
