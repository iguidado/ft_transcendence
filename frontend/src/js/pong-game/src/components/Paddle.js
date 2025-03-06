import * as THREE from 'three';
import { contextRegistry } from '../core/ContextRegistry.js';

export class Paddle {
    constructor({color=0xff0000, isLeft=false}={}) {
        const context = contextRegistry.getCurrentContext();
		console.log(context)
        const config = context.config;
        const height = config.paddles.length;
        const width = config.paddles.width;
        const depth = config.paddles.depth;
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshBasicMaterial({ color: color });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.x = config.board.width/2 * (isLeft ? -1 : 1);
        this.mesh.position.y = 0;
        context.scene.add(this.mesh);
    }
}