import * as THREE from "three"
import { scene } from "./scene.js"

export function addLine(points, color = 0xffffff) {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: color });
    const line = new THREE.Line(geometry, material);
    scene.add(line);
    return line;
}