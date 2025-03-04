import * as THREE from "three"
import { addLine } from "./tools.js"
import { scene } from "./scene.js"

export class Ball {
	displayDirectionVectorLength=5
	constructor({x, y, radius, direction, speed, color} = {}) {
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
		// console.log("Ball constructor:", this)
	}

	move() {
		let hit = this.raycaster()
		if (hit) {
			if (Math.abs(hit.face.normal.x) > Math.abs(hit.face.normal.y)) {
				this.direction.x = -this.direction.x;
			} else {
				this.direction.y = -this.direction.y;
			}
		}
		this.ball.position.x += this.direction.x * this.speed
		this.ball.position.y += this.direction.y * this.speed
	}

	displayDirectionVector() {
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
		addLine([rayOrigin, rayEnd])
	}

	debugObjects = []

	raycaster() {
		this.debugObjects.forEach(obj => scene.remove(obj))
		const startPos = this.ball.position.clone();
		const normalizedDir = this.direction.clone().normalize();
		const radius = this.ball.geometry.parameters.radius;

		const numRays = 10;
		const arcAngle = Math.PI;
		
		// Récupérer et mettre à jour les meshes
		const meshes = scene.children.filter(obj => 
			obj.type === 'Mesh' && obj !== this.ball
		);
		let hits = []
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
			raycaster.far = 20;   // Limiter la distance de détection
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
				const debugSphere = new THREE.Mesh(
					new THREE.SphereGeometry(0.1),
					new THREE.MeshBasicMaterial({color: 0xff0000})
				);
				debugSphere.position.copy(hitPoint);
				this.debugObjects.push(debugSphere)
				scene.add(debugSphere);
			}

			// Visualisation du rayon
			const rayLength = validIntersects.length > 0 ? validIntersects[0].distance : 10;
			const rayEnd = new THREE.Vector3(
				rayStart.x + rayDirection.x * rayLength,
				rayStart.y + rayDirection.y * rayLength,
				0
			);

			const rayColor = validIntersects.length > 0 ? 0xff0000 : 0x00ff00;
			this.debugObjects.push(addLine([rayStart, rayEnd], rayColor));

			
			// Mise à jour de la collision la plus proche
			if (validIntersects.length > 0 && validIntersects[0].distance < closestDistance) {
				closestDistance = validIntersects[0].distance;
				closestIntersection = validIntersects[0];
			}
		}
		return closestDistance < this.speed ? closestIntersection : null;
	}
}