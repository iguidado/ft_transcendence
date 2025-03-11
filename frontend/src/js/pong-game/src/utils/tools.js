import * as THREE from "three"
import { gameRegistry } from "../core/GameRegistry.js"

export function addLine(points, color = 0xffffff) {
	const context = gameRegistry.getCurrentContext()
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({ color: color })
    const line = new THREE.Line(geometry, material)
    context.scene.add(line)
    return line
}