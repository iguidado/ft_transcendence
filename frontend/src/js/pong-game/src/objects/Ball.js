import * as THREE from "three"
import { addLine } from "../utils/addLine.js"
import {gameRegistry} from "../core/GameRegistry.js"

export class Ball {
	constructor({x, y, radius, direction, speed, color, paddleBoncingSpeedMultiplicator} = {}) {
		const context = gameRegistry.getCurrentContext();
        const config = context.config;
		
		this.direction = direction || new THREE.Vector3(1, 0, 0); 
		this.speed = speed || config.ball.speed;
		this.radius = radius || config.ball.radius;
		this.color = color || config.ball.color;
		this.paddleBoncingSpeedMultiplicator = paddleBoncingSpeedMultiplicator || config.ball.paddleBoncingSpeedMultiplicator;

		this.geometry = new THREE.SphereGeometry(this.radius);
		this.material = new THREE.MeshBasicMaterial({ color: this.color });
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		
		this.mesh.position.x = x || config.ball.x;
		this.mesh.position.y = y || config.ball.y;
		this.mesh.position.z = 0;
		
		this.defaultDirection = this.direction.clone();
		this.defaultSpeed = this.speed;
		this.defaultPosition = this.mesh.position.clone();
	}
	reset() {
		const context = gameRegistry.getCurrentContext();
        const config = context.config;
		this.direction = this.defaultDirection
		this.speed = config.ball.speed
		this.paddleLeft = config.paddles.speed
		this.paddleRight = config.paddles.speed
		this.mesh.position.set(this.defaultPosition.x, this.defaultPosition.y, this.defaultPosition.z)
	}

	bounceOnObject() {
		const context = gameRegistry.getCurrentContext();
        const config = context.config;
		let hit = this.scanForObstacles()
		if (hit) {
			const hitObject = hit.object;
			const paddleRight = context.boardManager.paddleRight
			const paddleLeft = context.boardManager.paddleLeft
			if (hitObject === paddleLeft.mesh || hitObject === paddleRight.mesh) {
				const paddleHeight = hitObject.geometry.parameters.height;
				const relativeHitY = (hit.point.y - hitObject.position.y) / (paddleHeight / 2);

				const bounceAngle = relativeHitY * config.paddles.maxBounceAngle;
				
				if (hitObject === paddleLeft.mesh) {
					this.direction.x = Math.cos(bounceAngle);
					this.direction.y = Math.sin(bounceAngle);
				} else {
					this.direction.x = -Math.cos(bounceAngle);
					this.direction.y = Math.sin(bounceAngle);
				}
				
				this.direction.normalize();
				
				if (this.speed * this.paddleBoncingSpeedMultiplicator < config.ball.maxSpeed) {
					this.speed *= this.paddleBoncingSpeedMultiplicator
				}
				else if (this.speed != config.ball.maxSpeed) {
					this.speed = config.ball.maxSpeed
				}
			} else {
				if (Math.abs(hit.face.normal.x) > Math.abs(hit.face.normal.y)) {
					this.direction.x = -this.direction.x;
				} else {
					this.direction.y = -this.direction.y;
				}
			}
		}
	}

	move() {
		this.bounceOnObject()
		this.mesh.position.x += this.direction.x * this.speed;
		this.mesh.position.y += this.direction.y * this.speed;
	}

	debugObjects = []

	scanForObstacles() {
		const context = gameRegistry.getCurrentContext();
        const config = context.config;
		if (config.ball.debugRayCaster) {
			this.debugObjects.forEach(obj => context.scene.remove(obj))
			this.debugObjects = []
		}
		const startPos = this.mesh.position.clone();
		const normalizedDir = this.direction.clone().normalize();
		const radius = this.mesh.geometry.parameters.radius;

		const numRays = 10;
		const arcAngle = Math.PI;
		
		const meshes = context.boardManager.boardGroup.children.filter(obj => 
			obj.type === 'Mesh' && obj !== this.mesh
		);
		meshes.forEach(mesh => {
			mesh.updateMatrixWorld(true);
			mesh.geometry.computeBoundingBox();
			mesh.geometry.computeBoundingSphere();
		});

		const directionAngle = Math.atan2(normalizedDir.y, normalizedDir.x);
		let closestIntersection = null;
		let closestDistance = Infinity;

		for (let i = 0; i < numRays; i++) {
			const relativeAngle = (arcAngle / (numRays - 1)) * (i - (numRays - 1) / 2);
			const rayAngle = directionAngle + relativeAngle;

			const rayStart = new THREE.Vector3(
				startPos.x + Math.cos(rayAngle) * radius,
				startPos.y + Math.sin(rayAngle) * radius,
				0
			);

			const rayDirection = normalizedDir;

			const raycaster = new THREE.Raycaster();
			raycaster.near = 0; 
			raycaster.far = config.board.width;
			raycaster.set(rayStart, rayDirection);

			const intersects = raycaster.intersectObjects(meshes, false);

			const validIntersects = intersects.filter(intersect => 
				intersect.distance > raycaster.near && 
				intersect.distance < raycaster.far
			);

			if (validIntersects.length > 0) {
				const hit = validIntersects[0];

				const hitPoint = new THREE.Vector3().copy(hit.point);
				if (config.ball.debugRayCaster) {
					const debugSphere = new THREE.Mesh(
						new THREE.SphereGeometry(0.1),
						new THREE.MeshBasicMaterial({color: 0xff0000})
					);
					debugSphere.position.copy(hitPoint);
					this.debugObjects.push(debugSphere)
					context.scene.add(debugSphere);
				}
			}

			if (config.ball.debugRayCaster) {
				const rayLength = validIntersects.length > 0 ? validIntersects[0].distance : config.board.width;
				const rayEnd = new THREE.Vector3(
					rayStart.x + rayDirection.x * rayLength,
					rayStart.y + rayDirection.y * rayLength,
					0
				);
				const rayColor = validIntersects.length > 0 ? 0xff0000 : 0x00ff00;
				this.debugObjects.push(addLine([rayStart, rayEnd], rayColor));
			}
			
			if (validIntersects.length > 0 && validIntersects[0].distance < closestDistance) {
				closestDistance = validIntersects[0].distance;
				closestIntersection = validIntersects[0];
			}
		}
		return closestDistance < this.speed ? closestIntersection : null;
	}
}