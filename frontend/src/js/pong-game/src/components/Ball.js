import * as THREE from "three"
import { addLine } from "../utils/tools.js"
import {contextRegistry} from "../core/ContextRegistry.js"

export class Ball {
	constructor({x, y, radius, direction, speed, color, paddleBoncingSpeedMultiplicator} = {}) {
		const context = contextRegistry.getCurrentContext();
        const config = context.config;
		this.direction = direction || config.ball.direction
		this.speed = speed || config.ball.speed
		this.radius = radius || config.ball.radius
		this.color = color || config.ball.color
		this.geometry = new THREE.SphereGeometry(this.radius)
		this.material = new THREE.MeshBasicMaterial( { color: this.color } );
		this.ball = new THREE.Mesh( this.geometry, this.material );
		this.paddleBoncingSpeedMultiplicator = paddleBoncingSpeedMultiplicator || config.ball.paddleBoncingSpeedMultiplicator

		
		this.ball.position.x = x || config.ball.x
		this.ball.position.y = y || config.ball.y
		
		this.defaultDirection = this.direction
		this.defaultSpeed = this.speed
		this.defaultPosition = this.ball.position.clone()

		context.scene.add( this.ball );
	}
	reset() {
		this.direction = this.defaultDirection
		this.speed = this.defaultSpeed
		this.ball.position.set(this.defaultPosition.x, this.defaultPosition.y, this.defaultPosition.z)
	}

	bounceOnObject() {
		const context = contextRegistry.getCurrentContext();
        const config = context.config;
		let hit = this.scanForObstacles()
		if (hit) {
			const hitObject = hit.object;
			if (hitObject === context.paddleLeft.mesh || hitObject === context.paddleRight.mesh) {
				const paddleHeight = hitObject.geometry.parameters.height;
				const relativeHitY = (hit.point.y - hitObject.position.y) / (paddleHeight / 2);

				const bounceAngle = relativeHitY * config.paddles.maxBounceAngle;
				
				if (hitObject === context.paddleLeft.mesh) {
					this.direction.x = Math.cos(bounceAngle);
					this.direction.y = Math.sin(bounceAngle);
				} else { // paddleRight.mesh
					this.direction.x = -Math.cos(bounceAngle);
					this.direction.y = Math.sin(bounceAngle);
				}
				
				this.direction.normalize();
				
				if (this.speed * this.paddleBoncingSpeedMultiplicator < config.ball.maxSpeed)
					this.speed *= this.paddleBoncingSpeedMultiplicator
				else if (this.speed != config.ball.maxSpeed)
					this.speed = config.ball.maxSpeed
				console.log(this.speed)
			} else {
				// Handle other collisions (walls, etc.)
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
		this.ball.position.x += this.direction.x * this.speed;
		this.ball.position.y += this.direction.y * this.speed;
	}

	debugObjects = []

	scanForObstacles() {
		const context = contextRegistry.getCurrentContext();
        const config = context.config;
		if (config.ball.debugRayCaster)
			this.debugObjects.forEach(obj => context.scene.remove(obj))
		const startPos = this.ball.position.clone();
		const normalizedDir = this.direction.clone().normalize();
		const radius = this.ball.geometry.parameters.radius;

		const numRays = 10;
		const arcAngle = Math.PI;
		
		// Récupérer et mettre à jour les meshes
		const meshes = context.scene.children.filter(obj => 
			obj.type === 'Mesh' && obj !== this.ball
		);
		// Force update des matrices
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

			 // Position de départ ajustée pour être exactement sur le bord de la sphère
			const rayStart = new THREE.Vector3(
				startPos.x + Math.cos(rayAngle) * radius,
				startPos.y + Math.sin(rayAngle) * radius,
				0
			);

			// Toujours utiliser la direction du mouvement (pas l'angle du rayon)
			const rayDirection = normalizedDir;

			const raycaster = new THREE.Raycaster();
			raycaster.near = 0; // Ignorer les intersections trop proches
			raycaster.far = config.board.width;   // Limiter la distance de détection
			raycaster.set(rayStart, rayDirection);

			const intersects = raycaster.intersectObjects(meshes, false);

			// Filtrer les intersections valides
			const validIntersects = intersects.filter(intersect => 
				intersect.distance > raycaster.near && 
				intersect.distance < raycaster.far
			);

			if (validIntersects.length > 0) {
				const hit = validIntersects[0];
				// console.log(`Ray ${i}: angle=${(rayAngle * 180 / Math.PI).toFixed(2)}°, distance=${hit.distance.toFixed(2)}`);

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

			if (config.ball.debugRayCaster) { // Visualisation du rayon
				const rayLength = validIntersects.length > 0 ? validIntersects[0].distance : config.board.width;
				const rayEnd = new THREE.Vector3(
					rayStart.x + rayDirection.x * rayLength,
					rayStart.y + rayDirection.y * rayLength,
					0
				);
				const rayColor = validIntersects.length > 0 ? 0xff0000 : 0x00ff00;
				this.debugObjects.push(addLine([rayStart, rayEnd], rayColor));
			}
			
			// Mise à jour de la collision la plus proche
			if (validIntersects.length > 0 && validIntersects[0].distance < closestDistance) {
				closestDistance = validIntersects[0].distance;
				closestIntersection = validIntersects[0];
			}
		}
		return closestDistance < this.speed ? closestIntersection : null;
	}
}