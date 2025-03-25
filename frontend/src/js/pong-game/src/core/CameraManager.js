import * as THREE from 'three'
import { gameRegistry } from './GameRegistry'

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
        // const rotatedBox = this.getRotatedBoundingBox(box);
        
        // Debug the rotated box
        this.debugRotatedBox(box);
        
        // Pass phi and theta to calculateOptimalRadius
        return this.calculateOptimalRadius(box, this.config.polar.phi, this.config.polar.theta);
    }

    createGameBoundingBox() {
        // Créer une nouvelle Box3 à partir du boardGroup du BoardManager
        const boardGroup = this.game.boardManager.boardGroup;
        const box = new THREE.Box3().setFromObject(boardGroup);
        return box;
    }

    getRotatedBoundingBox(box) {
        const rotationMatrix = new THREE.Matrix4().makeRotationFromEuler(
            new THREE.Euler(
                this.config.polar.rotateX,
                this.config.polar.rotateY,
                this.config.polar.rotateZ,
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

    calculateOptimalRadius(rotatedBox, phi, theta) {
        const size = new THREE.Vector3();
        rotatedBox.getSize(size);
        const center = new THREE.Vector3();
        rotatedBox.getCenter(center);

        // Create a camera direction vector based on phi and theta
        const cameraDirection = new THREE.Vector3(
            Math.sin(theta) * Math.cos(phi),
            Math.sin(phi),
            Math.cos(theta) * Math.cos(phi)
        ).normalize();

        // Calculate vertical and horizontal FOVs
        const vFov = this.config.fov * Math.PI / 180;
        const aspect = this.camera.aspect;
        const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);

        // Calculate corners of the bounding box
        const halfWidth = size.x / 2;
        const halfHeight = size.y / 2;
        const halfDepth = size.z / 2;
        
        const corners = [
            new THREE.Vector3(center.x - halfWidth, center.y - halfHeight, center.z - halfDepth),
            new THREE.Vector3(center.x - halfWidth, center.y - halfHeight, center.z + halfDepth),
            new THREE.Vector3(center.x - halfWidth, center.y + halfHeight, center.z - halfDepth),
            new THREE.Vector3(center.x - halfWidth, center.y + halfHeight, center.z + halfDepth),
            new THREE.Vector3(center.x + halfWidth, center.y - halfHeight, center.z - halfDepth),
            new THREE.Vector3(center.x + halfWidth, center.y - halfHeight, center.z + halfDepth),
            new THREE.Vector3(center.x + halfWidth, center.y + halfHeight, center.z - halfDepth),
            new THREE.Vector3(center.x + halfWidth, center.y + halfHeight, center.z + halfDepth)
        ];

        // Create view plane perpendicular to camera direction
        const viewPlaneNormal = cameraDirection.clone();
        const viewPlane = new THREE.Plane().setFromNormalAndCoplanarPoint(
            viewPlaneNormal, 
            new THREE.Vector3(0, 0, 0)
        );

        // Project all corners onto the view plane
        const projectedPoints = corners.map(corner => {
            const projected = new THREE.Vector3();
            viewPlane.projectPoint(corner, projected);
            return projected;
        });

        // Find the right and up vectors on the view plane
        const upVector = new THREE.Vector3(0, 1, 0);
        // If camera is nearly vertical, use a different up reference
        if (Math.abs(Math.cos(phi)) < 0.1) {
            upVector.set(0, 0, 1);
        }
        
        const rightVector = new THREE.Vector3().crossVectors(upVector, viewPlaneNormal).normalize();
        // Recalculate the up vector to ensure it's perpendicular to both the view direction and right vector
        upVector.crossVectors(viewPlaneNormal, rightVector).normalize();

        // Calculate 2D bounds of the projected points on the view plane
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        
        projectedPoints.forEach(point => {
            const projectedX = point.dot(rightVector);
            const projectedY = point.dot(upVector);
            
            minX = Math.min(minX, projectedX);
            maxX = Math.max(maxX, projectedX);
            minY = Math.min(minY, projectedY);
            maxY = Math.max(maxY, projectedY);
        });

        // Calculate required distances
        const projectedWidth = maxX - minX;
        const projectedHeight = maxY - minY;
        
        // Calculate required radius for vertical and horizontal FOVs
        const radiusForHeight = (projectedHeight / 2) / Math.tan(vFov / 2);
        const radiusForWidth = (projectedWidth / 2) / Math.tan(hFov / 2);
        
        // Get the maximum radius to ensure everything is visible
        const requiredRadius = Math.max(radiusForHeight, radiusForWidth);
        
        // Apply user-configured margin
        return requiredRadius * this.config.polar.calculatedRadiusMargin;
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