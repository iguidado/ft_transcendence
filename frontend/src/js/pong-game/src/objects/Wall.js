import * as THREE from "three"
import { gameRegistry } from "../core/GameRegistry";

export class Wall {
	constructor({height, width, depth, x, y, color} = {}) {
		const context = gameRegistry.getCurrentContext();
		this.height = height || 0
		this.width = width || 0
		this.depth = depth || 0
		this.color = color || 0x00ff00
		this.geometry = new THREE.BoxGeometry(this.width, this.height, this.depth)
		this.material = new THREE.MeshBasicMaterial( { color: this.color } )
		this.mesh = new THREE.Mesh( this.geometry, this.material )
		if (x)
			this.mesh.position.x = x
		if (y)
			this.mesh.position.y = y
		context.scene.add(this.mesh)
	}
}