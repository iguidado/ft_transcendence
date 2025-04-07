import * as THREE from 'three'
import { gameRegistry } from './GameRegistry.js'

export class CameraManager {
    constructor(game, container, customConfig = {}) {
        this.game = game;
        this.container = container;
        this.context = gameRegistry.getCurrentContext();

        // Merge the camera configuration
        this.config = {
            ...this.context.config.camera,
            ...customConfig,
            board: this.context.config.board,
            paddles: this.context.config.paddles
        };

        // Use the FOV from the configuration
        this.camera = new THREE.PerspectiveCamera(
            this.config.fov || 75, // Default FOV is 75
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );

        this.rotationSpeed = this.config.controls.rotationSpeed;
        this.phiSpeed = this.config.controls.phiSpeed;
        this.thetaSpeed = this.config.controls.thetaSpeed;
        this.radiusSpeed = this.config.controls.radiusSpeed;
        this.marginSpeed = this.config.controls.marginSpeed;
    }

    init() {
        this.updateAspectRatio();
        const radius = this.calculateRadius();
        this.positionCamera(radius);
        this.orientCamera();
    }

    updateAspectRatio() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    calculateRadius() {
		if (!this.config.polar.useCalculatedRadius) {
			return this.config.polar.radius;
		}
		const box = this.createGameBoundingBox();
		// this.debugRotatedBox(box);
		return this.calculateOptimalRadius(box);
	}

    createGameBoundingBox() {
		const boardGroup = this.game.boardManager.boardGroup;
		const box = new THREE.Box3().setFromObject(boardGroup);
		const margin = this.config.boundingBoxMargin || 0;
		const expandVector = new THREE.Vector3(margin, margin, margin);
		box.expandByVector(expandVector);
		return box;
	}

    // getRotatedBoundingBox(box) {
    //     const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(
    //         new THREE.Euler(
    //             this.config.polar.rotateX,
    //             this.config.polar.rotateY,
    //             this.config.polar.rotateZ,
    //             'XYZ'
    //         )
    //     );

    //     const corners = [
    //         new THREE.Vector3(box.min.x, box.min.y, box.min.z),
    //         new THREE.Vector3(box.min.x, box.min.y, box.max.z),
    //         new THREE.Vector3(box.min.x, box.max.y, box.min.z),
    //         new THREE.Vector3(box.min.x, box.max.y, box.max.z),
    //         new THREE.Vector3(box.max.x, box.min.y, box.min.z),
    //         new THREE.Vector3(box.max.x, box.min.y, box.max.z),
    //         new THREE.Vector3(box.max.x, box.max.y, box.min.z),
    //         new THREE.Vector3(box.max.x, box.max.y, box.max.z),
    //     ];

    //     corners.forEach(corner => corner.applyMatrix4(rotationMatrix));
    //     const rotatedBox = new THREE.Box3();
    //     corners.forEach(corner => rotatedBox.expandByPoint(corner));
    //     return rotatedBox;
    // }

    calculateOptimalRadius(box) {
        // Get the corners of the box
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

        // Calculate FOVs
        const vFov = this.config.fov * Math.PI / 180;
        const aspect = this.camera.aspect;
        const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);

        let maxRadius = 0;

        // Check each corner
        corners.forEach(corner => {
            // Calculate required radius for this corner
            const heightRadius = Math.abs(corner.y) / Math.tan(vFov / 2);
            const widthRadius = Math.abs(corner.x) / Math.tan(hFov / 2);
            const depthRadius = Math.abs(corner.z);

            // Get maximum radius needed for this corner
            const cornerRadius = Math.max(heightRadius, widthRadius, depthRadius);
            maxRadius = Math.max(maxRadius, cornerRadius);
        });

        // Apply margin
        return maxRadius * this.config.polar.calculatedRadiusMargin;
    }

    positionCamera(radius) {
        const { phi, theta } = this.config.polar;
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
        this.camera.lookAt(this.config.lookAt);
    }

    getRotationMatrix() {
        return new THREE.Matrix4().makeRotationFromEuler(
            new THREE.Euler(
                this.config.polar.rotateX,
                this.config.polar.rotateY,
                this.config.polar.rotateZ,
                'XYZ'
            )
        );
    }

    rotateUpX() {
        this.config.polar.rotateX += this.rotationSpeed
        this.init()
		return this
	}

    rotateDownX() {
        this.config.polar.rotateX -= this.rotationSpeed
        this.init()
		return this
	}

    rotateUpY() {
        this.config.polar.rotateY += this.rotationSpeed
        this.init()
		return this
	}

    rotateDownY() {
        this.config.polar.rotateY -= this.rotationSpeed
        this.init()
		return this
	}

    rotateUpZ() {
        this.config.polar.rotateZ += this.rotationSpeed
        this.init()
		return this
	}

    rotateDownZ() {
        this.config.polar.rotateZ -= this.rotationSpeed
        this.init()
		return this
	}

    phiUp() {
        this.config.polar.phi = 
        (this.config.polar.phi + this.phiSpeed) % (2 * Math.PI)
        this.init()
		return this
	}

    phiDown() {
        this.config.polar.phi =
            (this.config.polar.phi - this.phiSpeed) % (2 * Math.PI)
        this.init()
		return this
	}

    thetaUp() {
        this.config.polar.theta
            = (this.config.polar.theta + this.thetaSpeed) % (2 * Math.PI)
        this.init()
		return this
	}

    thetaDown() {
        this.config.polar.theta
            = (this.config.polar.theta - this.thetaSpeed) % (2 * Math.PI)
        this.init()
		return this
	}

    toggleCalculatedRadius() {
        this.config.polar.useCalculatedRadius 
            = !this.config.polar.useCalculatedRadius
        this.init()
		return this
	}

    calculatedRadiusMarginUp() {
        this.config.polar.calculatedRadiusMargin += this.marginSpeed
        this.init()
		return this
	}

    calculatedRadiusMarginDown() {
        this.config.polar.calculatedRadiusMargin -= this.marginSpeed
        this.init()
		return this
	}

    logCameraConfig() {
        console.log('Camera parameters:', {
            rotateX: this.config.polar.rotateX,
            rotateY: this.config.polar.rotateY,
            rotateZ: this.config.polar.rotateZ,
            phi: this.config.polar.phi,
            theta: this.config.polar.theta,
            radius: this.config.polar.radius,
            useCalculatedRadius: this.config.polar.useCalculatedRadius,
            calculatedRadiusMargin: this.config.polar.calculatedRadiusMargin
        })
    }

    debugRotatedBox(rotatedBox) {
        // Remove any existing debug box
        const existingHelper = this.game.scene.getObjectByName('debugBox');
        if (existingHelper) {
            this.game.scene.remove(existingHelper);
        }

        // Create a Box3Helper to visualize the bounding box
        const helper = new THREE.Box3Helper(rotatedBox, 0xff0000);
        helper.name = 'debugBox';
        helper.material.depthTest = false;
        helper.material.transparent = true;
        helper.material.opacity = 0.5;
        
        // Add the helper to the scene
        this.game.scene.add(helper);
    }
}