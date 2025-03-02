import * as THREE from "three"

export class Ball {
	displayDirectionVectorLength=5
	constructor(scene, {x, y, radius, direction, speed, color} = {}) {
		this.direction = direction?.normalize() || new THREE.Vector3(0, 0, 0)
		this.speed = speed || 0
		this.color = color || 0x00ff00
		this.radius = radius || 1
		this.geometry = new THREE.SphereGeometry(this.radius)
		this.material = new THREE.MeshBasicMaterial( { color: this.color } );
		this.ball = new THREE.Mesh( this.geometry, this.material );
		if (x)
			this.ball.position.x = x
		if (y)
			this.ball.position.y = y
		scene.add( this.ball );
		console.log("Ball constructor:", this)
	}

	move() {
		this.ball.position.x += this.direction.x * this.speed
		this.ball.position.y += this.direction.y * this.speed
	}

	displayDirectionVector(scene) {
		let rayOrigin = new THREE.Vector3(
			this.ball.position.x + this.radius * this.direction.x,
			this.ball.position.y + this.radius * this.direction.y,
			this.ball.position.z + this.radius * this.direction.z
		)
		let rayEnd = new THREE.Vector3(
			this.direction.x * this.displayDirectionVectorLength + this.ball.position.x,
			this.direction.y * this.displayDirectionVectorLength + this.ball.position.y,
			this.direction.y * this.displayDirectionVectorLength + this.ball.position.z
		)
		const points = [rayOrigin, rayEnd]

		const geometry = new THREE.BufferGeometry().setFromPoints(points);

		const material = new THREE.LineBasicMaterial({ color: 0x0000ff });

		const line = new THREE.Line(geometry, material);

		scene.add(line)
	}

	displayShapeProjection(scene) {
		let firstRayOrigin = new THREE.Vector3(
			this.direction.x,
			this.direction.y,
			this.direction.z
		)
		let lastRayOrigin = new THREE.Vector3(
			this.direction.x,
			this.direction.y,
			this.direction.z
		)
		for (let i=0; i <= this.radius*2; i++) {
			let rayOrigin = new THREE.Vector3(
				this.ball.position.x + this.radius * this.direction.x,
				this.ball.position.y + this.radius * this.direction.y,
				this.ball.position.z + this.radius * this.direction.z
			)
			let rayEnd = new THREE.Vector3(
				this.direction.x * this.displayDirectionVectorLength + this.ball.position.x,
				this.direction.y * this.displayDirectionVectorLength + this.ball.position.y,
				this.direction.y * this.displayDirectionVectorLength + this.ball.position.z
			)
			const points = [rayOrigin, rayEnd]
	
			const geometry = new THREE.BufferGeometry().setFromPoints(points);
	
			const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
	
			const line = new THREE.Line(geometry, material);
	
			scene.add(line)
		}
	}
}