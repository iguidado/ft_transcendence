import * as THREE from "three"
import { contextRegistry } from "../core/ContextRegistry.js";

export function addLine(points, color = 0xffffff) {
	const context = contextRegistry.getCurrentContext();
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: color });
    const line = new THREE.Line(geometry, material);
    context.scene.add(line);
    return line;
}