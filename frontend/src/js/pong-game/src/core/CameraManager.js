import * as THREE from 'three'
import { gameRegistry } from './GameRegistry.js'

export class CameraManager {
    constructor(game, container, customConfig = {}) {
        this.game = game;
        this.container = container;
        this.context = gameRegistry.getCurrentContext();
        
        // Make sure we always use the game's board and paddles configuration,
        // even when a custom camera config is provided
        this.config = {
            ...this.context.config.camera,
            ...customConfig,
            // Ensure we always have access to these critical game dimensions
            board: this.context.config.board,
            paddles: this.context.config.paddles
        };
        this.camera = new THREE.PerspectiveCamera(
            this.config.fov,
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

    calculateOptimalRadius(rotatedBox) {
        const size = new THREE.Vector3();
        rotatedBox.getSize(size);

        const vFov = this.config.fov * Math.PI / 180;
        const aspect = this.camera.aspect;
        const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);

        const radiusForHeight = size.y / (2 * Math.tan(vFov / 2));
        const radiusForWidth = size.x / (2 * Math.tan(hFov / 2));
        const radiusForDepth = size.z;

        return Math.max(radiusForHeight, radiusForWidth, radiusForDepth) * 
               this.config.polar.calculatedRadiusMargin;
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
    }

    rotateDownX() {
        this.config.polar.rotateX -= this.rotationSpeed
        this.init()
    }

    rotateUpY() {
        this.config.polar.rotateY += this.rotationSpeed
        this.init()
    }

    rotateDownY() {
        this.config.polar.rotateY -= this.rotationSpeed
        this.init()
    }

    rotateUpZ() {
        this.config.polar.rotateZ += this.rotationSpeed
        this.init()
    }

    rotateDownZ() {
        this.config.polar.rotateZ -= this.rotationSpeed
        this.init()
    }

    phiUp() {
        this.config.polar.phi = 
        (this.config.polar.phi + this.phiSpeed) % (2 * Math.PI)
        this.init()
    }

    phiDown() {
        this.config.polar.phi =
            (this.config.polar.phi - this.phiSpeed) % (2 * Math.PI)
        this.init()
    }

    thetaUp() {
        this.config.polar.theta
            = (this.config.polar.theta + this.thetaSpeed) % (2 * Math.PI)
        this.init()
    }

    thetaDown() {
        this.config.polar.theta
            = (this.config.polar.theta - this.thetaSpeed) % (2 * Math.PI)
        this.init()
    }

    toggleCalculatedRadius() {
        this.config.polar.useCalculatedRadius 
            = !this.config.polar.useCalculatedRadius
        this.init()
    }

    calculatedRadiusMarginUp() {
        this.config.polar.calculatedRadiusMargin += this.marginSpeed
        this.init()
    }

    calculatedRadiusMarginDown() {
        this.config.polar.calculatedRadiusMargin -= this.marginSpeed
        this.init()
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
}