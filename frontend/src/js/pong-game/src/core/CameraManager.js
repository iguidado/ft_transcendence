import * as THREE from 'three'
import { gameRegistry } from './GameRegistry'

export class CameraManager {
	constructor() {
		this.context = gameRegistry.getCurrentContext()
		this.config = this.context.config
		this.camera = new THREE.PerspectiveCamera(
			this.config.camera.fov,
			this.context.container.clientWidth / this.context.container.clientHeight,
			0.1,
			1000
		)
	}

	init() {
		this.updateAspectRatio();
        const radius = this.calculateRadius();
        this.positionCamera(radius);
        this.orientCamera();
	}

	updateAspectRatio() {
		const width = this.context.container.clientWidth;
        const height = this.context.container.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
	}

	calculateRadius() {
		if (!this.config.camera.polar.useCalculatedRadius) {
            return this.config.camera.polar.radius;
        }
        const box = this.createGameBoundingBox();
        const rotatedBox = this.getRotatedBoundingBox(box);
        return this.calculateOptimalRadius(rotatedBox);
	}

	createGameBoundingBox() {
		const boxGeometry = new THREE.BoxGeometry(
            this.config.board.width + 2 * this.config.paddles.width,
            this.config.board.height + 2 * this.config.board.wallWidth,
            this.config.board.depth
        );
        return new THREE.Box3().setFromObject(new THREE.Mesh(boxGeometry));
	}

	getRotatedBoundingBox(box) {
		const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(
            new THREE.Euler(
                this.config.camera.polar.rotateX,
                this.config.camera.polar.rotateY,
                this.config.camera.polar.rotateZ,
                'XYZ'
            )
        );

        const corners = [
            new THREE.Vector3(box.min.x, box.min.y, box.min.z),
            new THREE.Vector3(box.min.x, box.min.y, box.max.z),
            new THREE.Vector3(box.min.x, box.max.y, box.min.z),
            new THREE.Vector3(box.min.x, box.max.y, box.max.z),
            new THREE.Vector3(box.max.x, box.min.y, box.min.z),
            new THREE.Vector3(box.max.x, box.min.y, box.max.z),
            new THREE.Vector3(box.max.x, box.max.y, box.min.z),
            new THREE.Vector3(box.max.x, box.max.y, box.max.z),
        ];

        corners.forEach(corner => corner.applyMatrix4(rotationMatrix));
        const rotatedBox = new THREE.Box3();
        corners.forEach(corner => rotatedBox.expandByPoint(corner));
        return rotatedBox;
	}

	calculateOptimalRadius(rotatedBox) {
		const size = new THREE.Vector3();
        rotatedBox.getSize(size);

        const vFov = this.config.camera.fov * Math.PI / 180;
        const aspect = this.camera.aspect;
        const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);

        const radiusForHeight = size.y / (2 * Math.tan(vFov / 2));
        const radiusForWidth = size.x / (2 * Math.tan(hFov / 2));
        const radiusForDepth = size.z;

        return Math.max(radiusForHeight, radiusForWidth, radiusForDepth) * 
               this.config.camera.polar.calculatedRadiusMargin;
	}

	positionCamera(radius) {
		const { phi, theta } = this.config.camera.polar;
        const position = new THREE.Vector3(
            radius * Math.sin(theta) * Math.cos(phi),
            radius * Math.sin(phi),
            radius * Math.cos(theta) * Math.cos(phi)
        );

        const rotationMatrix = this.getRotationMatrix();
        position.applyMatrix4(rotationMatrix);
        this.camera.position.copy(position);
	}

	orientCamera() {
		const up = new THREE.Vector3(0, 1, 0);
        up.applyMatrix4(this.getRotationMatrix());
        this.camera.up.copy(up);
        this.camera.lookAt(this.config.camera.lookAt);
	}

	getRotationMatrix() {
		return new THREE.Matrix4().makeRotationFromEuler(
            new THREE.Euler(
                this.config.camera.polar.rotateX,
                this.config.camera.polar.rotateY,
                this.config.camera.polar.rotateZ,
                'XYZ'
            )
        );
	}
}