import * as THREE from "three"
import { scene } from "./scene.js"

export class CollitionBox {
	constructor({height, width, depth, x, y, color} = {}) {
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
		scene.add(this.mesh)
	}
}