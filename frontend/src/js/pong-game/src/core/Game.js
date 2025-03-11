import * as THREE from 'three';
import { gameRegistry } from './GameRegistry.js'
import { Paddle } from '../Objects/Paddle.js';
import { Ball } from '../Objects/Ball.js';
import { Wall } from '../Objects/Wall.js';
import { scoreMonitor } from './scoreMonitor.js';
import { initConfig } from '../config/initConfig.js';

let currId = 1

export class Game {
    constructor(container, config_edits = {}) {
        if (!container)
            throw new Error(`Container not found`);
        this.container = container
        this.gameId = currId++
        gameRegistry.registerContext(this.gameId, this)
        this.isRunning = false

        this.config = initConfig(config_edits)
        this.scene = new THREE.Scene();
        this.boardGroup = new THREE.Group();
        this.scene.add(this.boardGroup);
        this.camera = new THREE.PerspectiveCamera(
            this.config.camera.fov,
            this.container.clientWidth / this.container.clientHeight,
            0.1,
            1000
        );

        // Positionner initialement la caméra selon les coordonnées polaires
        const radius = this.config.camera.polar.radius;
        const phi = this.config.camera.polar.phi;
        const theta = this.config.camera.polar.theta;

        // Convertir les coordonnées polaires en cartésiennes
        this.camera.position.x = radius * Math.sin(theta) * Math.cos(phi);
        this.camera.position.y = radius * Math.sin(phi);
        this.camera.position.z = radius * Math.cos(theta) * Math.cos(phi);

        // Faire regarder la caméra vers le centre
        this.camera.lookAt(this.config.camera.lookAt);
        
        this.setupGame();
        this.handleResize();
        this.setupKeyBinds()
        this.keyState = {}
        this.scoreLeft = 0;
        this.scoreRight = 0;

        // Ajouter des styles au container
        this.container.style.backgroundColor = '#000';
        this.container.style.overflow = 'hidden';
    }

    animate() {
        if (!this.isRunning) return

        // Update game state
        this.update()

        // Render
        this.renderer.render(this.scene, this.camera)
        // Request next frame
        requestAnimationFrame(() => this.animate())
    }

    start() {
        if (this.isRunning) return
        this.isRunning = true
        this.animate()
    }

    stop() {
        this.isRunning = false
    }

    update() {
        this.handleKeyPress();
        this.updateBots();  // Ajout de cette ligne
        this.ball.move();
        scoreMonitor();
    }

    setupGame() {
        this.initSceneElements()

        // Initialiser le renderer avec antialiasing et fond transparent
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setClearColor(0x000000, 0); // fond noir transparent
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);

        // Debounce le resize pour de meilleures performances
        this.resizeDebounce = this.debounce(() => this.handleResize(), 16); // environ 60fps

        // Gestionnaire de redimensionnement optimisé
        window.addEventListener('resize', this.resizeDebounce);
        
        // Observer les changements de taille du container
        this.resizeObserver = new ResizeObserver(this.resizeDebounce);
        this.resizeObserver.observe(this.container);
        
        // Gestionnaire d'orientation
        window.addEventListener('orientationchange', this.resizeDebounce);
    }

    handleResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        const aspect = width / height;

        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);

        let radius;
        if (this.config.camera.polar.useCalculatedRadius) {
            // Create a box that represents the game board dimensions
            const boxGeometry = new THREE.BoxGeometry(
                this.config.board.width + 2 * this.config.paddles.width,
                this.config.board.height + 2 * this.config.board.wallWidth,
                this.config.board.depth
            );
            const box = new THREE.Box3().setFromObject(new THREE.Mesh(boxGeometry));
            
            // Apply all rotations to get the final oriented bounding box
            const rotationMatrix = new THREE.Matrix4();
            rotationMatrix.makeRotationFromEuler(new THREE.Euler(
                this.config.camera.polar.rotateX,
                this.config.camera.polar.rotateY,
                this.config.camera.polar.rotateZ,
                'XYZ'
            ));

            // Get all corners of the box
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

            // Apply rotation to all corners
            corners.forEach(corner => corner.applyMatrix4(rotationMatrix));

            // Calculate new bounding box after rotation
            const rotatedBox = new THREE.Box3();
            corners.forEach(corner => rotatedBox.expandByPoint(corner));
            
            // Calculate dimensions after rotation
            const size = new THREE.Vector3();
            rotatedBox.getSize(size);

            // Calculate required radius based on FOV and rotated dimensions
            const vFov = this.config.camera.fov * Math.PI / 180;
            const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);

            // Calculate distances needed for height and width
            const radiusForHeight = size.y / (2 * Math.tan(vFov / 2));
            const radiusForWidth = size.x / (2 * Math.tan(hFov / 2));
            const radiusForDepth = size.z;

            // Use the maximum radius to ensure everything is visible
            radius = Math.max(radiusForHeight, radiusForWidth, radiusForDepth) * 
                    this.config.camera.polar.calculatedRadiusMargin;
        } else {
            radius = this.config.camera.polar.radius;
        }

        // Rest of the method remains the same...
        const phi = this.config.camera.polar.phi;
        const theta = this.config.camera.polar.theta;

        const position = new THREE.Vector3(
            radius * Math.sin(theta) * Math.cos(phi),
            radius * Math.sin(phi),
            radius * Math.cos(theta) * Math.cos(phi)
        );

        const finalRotation = new THREE.Matrix4();
        finalRotation.makeRotationFromEuler(new THREE.Euler(
            this.config.camera.polar.rotateX,
            this.config.camera.polar.rotateY,
            this.config.camera.polar.rotateZ,
            'XYZ'
        ));

        position.applyMatrix4(finalRotation);
        this.camera.position.copy(position);

        const up = new THREE.Vector3(0, 1, 0);
        up.applyMatrix4(finalRotation);
        this.camera.up.copy(up);

        this.camera.lookAt(this.config.camera.lookAt);
    }

    initSceneElements() {
        gameRegistry.setCurrentContext(this.gameId);
        
        // Create walls
        this.wallTop = new Wall({
            height: this.config.board.wallWidth,
            width: this.config.board.width + this.config.board.wallWidth,
            depth: this.config.board.depth,
            y: this.config.board.height/2
        });
        
        this.wallBottom = new Wall({
            height: this.config.board.wallWidth,
            width: this.config.board.width + this.config.board.wallWidth,
            depth: this.config.board.depth,
            y: -this.config.board.height/2
        });
        
        // Create paddles and ball
        this.paddleLeft = new Paddle({ isLeft: true, color: 0x0000ff });
        this.paddleRight = new Paddle({ isLeft: false });
        this.ball = new Ball();
    
        // Add all elements to the board group
        this.boardGroup.add(this.wallTop.mesh);
        this.boardGroup.add(this.wallBottom.mesh);
        this.boardGroup.add(this.paddleLeft.mesh);
        this.boardGroup.add(this.paddleRight.mesh);
        this.boardGroup.add(this.ball.mesh);
    }

    setupKeyBinds() {
        document.addEventListener('keydown', (event) => {
            this.keyState[event.key] = true;
        });
        
        document.addEventListener('keyup', (event) => {
            this.keyState[event.key] = false;
        });
    }
    
    handleKeyPress() {
        const maxPaddleY = this.config.board.height/2 - this.config.paddles.length/2 - this.config.board.wallWidth;
        const minPaddleY = -this.config.board.height/2 + this.config.paddles.length/2 + this.config.board.wallWidth;
        const paddleSpeed = this.ball.speed * this.config.paddles.controls.speed;
        const { keys } = this.config.paddles.controls;
    
        // Right paddle controls (if not bot)
        if (!this.config.paddles.controls.rightBot) {
            if (this.keyState[keys.rightUp] && this.paddleRight.mesh.position.y < maxPaddleY) {
                this.paddleRight.mesh.position.y += paddleSpeed;
            }
            if (this.keyState[keys.rightDown] && this.paddleRight.mesh.position.y > minPaddleY) {
                this.paddleRight.mesh.position.y -= paddleSpeed;
            }
        }
    
        // Left paddle controls (if not bot)
        if (!this.config.paddles.controls.leftBot) {
            if (this.keyState[keys.leftUp] && this.paddleLeft.mesh.position.y < maxPaddleY) {
                this.paddleLeft.mesh.position.y += paddleSpeed;
            }
            if (this.keyState[keys.leftDown] && this.paddleLeft.mesh.position.y > minPaddleY) {
                this.paddleLeft.mesh.position.y -= paddleSpeed;
            }
        }
    
        // Camera controls
        if (!this.config.camera.controls.enabled) return;

        const {
            rotationSpeed,
            phiSpeed,
            thetaSpeed,
            radiusSpeed,
            marginSpeed,
            keys: cameraKeys
        } = this.config.camera.controls;
        
        // Rotation X controls
        if (this.keyState[cameraKeys.rotateXPos]) {
            this.config.camera.polar.rotateX += rotationSpeed;
            this.handleResize();
        }
        if (this.keyState[cameraKeys.rotateXNeg]) {
            this.config.camera.polar.rotateX -= rotationSpeed;
            this.handleResize();
        }
        
        // Rotation Y controls
        if (this.keyState[cameraKeys.rotateYPos]) {
            this.config.camera.polar.rotateY += rotationSpeed;
            this.handleResize();
        }
        if (this.keyState[cameraKeys.rotateYNeg]) {
            this.config.camera.polar.rotateY -= rotationSpeed;
            this.handleResize();
        }
        
        // Rotation Z controls
        if (this.keyState[cameraKeys.rotateZPos]) {
            this.config.camera.polar.rotateZ += rotationSpeed;
            this.handleResize();
        }
        if (this.keyState[cameraKeys.rotateZNeg]) {
            this.config.camera.polar.rotateZ -= rotationSpeed;
            this.handleResize();
        }
        
        // Phi angle controls
        if (this.keyState[cameraKeys.phiPos]) {
            this.config.camera.polar.phi = Math.min(Math.PI/2, this.config.camera.polar.phi + phiSpeed);
            this.handleResize();
        }
        if (this.keyState[cameraKeys.phiNeg]) {
            this.config.camera.polar.phi = Math.max(-Math.PI/2, this.config.camera.polar.phi - phiSpeed);
            this.handleResize();
        }

        // Theta angle controls
        if (this.keyState[cameraKeys.thetaPos]) {
            this.config.camera.polar.theta = (this.config.camera.polar.theta + thetaSpeed) % (2 * Math.PI);
            this.handleResize();
        }
        if (this.keyState[cameraKeys.thetaNeg]) {
            this.config.camera.polar.theta = (this.config.camera.polar.theta - thetaSpeed) % (2 * Math.PI);
            this.handleResize();
        }

        // Radius controls (only when not using calculated radius)
        if (!this.config.camera.polar.useCalculatedRadius) {
            if (this.keyState[cameraKeys.radiusIncrease]) {
                this.config.camera.polar.radius += radiusSpeed;
                this.handleResize();
            }
            if (this.keyState[cameraKeys.radiusDecrease]) {
                this.config.camera.polar.radius = Math.max(10, this.config.camera.polar.radius - radiusSpeed);
                this.handleResize();
            }
        }

        // Toggle calculated radius
        if (this.keyState[cameraKeys.toggleCalculatedRadius]) {
            this.config.camera.polar.useCalculatedRadius = !this.config.camera.polar.useCalculatedRadius;
            this.handleResize();
            this.keyState[cameraKeys.toggleCalculatedRadius] = false; // Prevent toggle spam
        }

        // Calculated radius margin controls
        if (this.config.camera.polar.useCalculatedRadius) {
            if (this.keyState[cameraKeys.marginIncrease]) {
                this.config.camera.polar.calculatedRadiusMargin += marginSpeed;
                this.handleResize();
            }
            if (this.keyState[cameraKeys.marginDecrease]) {
                this.config.camera.polar.calculatedRadiusMargin = Math.max(1, 
                    this.config.camera.polar.calculatedRadiusMargin - marginSpeed);
                this.handleResize();
            }
        }

        // Log camera parameters
        if (this.keyState[cameraKeys.logParams]) {
            console.log('Camera parameters:', {
                rotateX: this.config.camera.polar.rotateX,
                rotateY: this.config.camera.polar.rotateY,
                rotateZ: this.config.camera.polar.rotateZ,
                phi: this.config.camera.polar.phi,
                theta: this.config.camera.polar.theta,
                radius: this.config.camera.polar.radius,
                useCalculatedRadius: this.config.camera.polar.useCalculatedRadius,
                calculatedRadiusMargin: this.config.camera.polar.calculatedRadiusMargin
            });
            this.keyState[cameraKeys.logParams] = false;
        }
    }

    // Ajouter cette méthode de debounce
    debounce(func, wait) {
        let timeout;
        return (...args) => {
            // Garder le rendu actif pendant le resize
            this.renderer.render(this.scene, this.camera);
            
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                func.apply(this, args);
                // Rendu final après le resize
                this.renderer.render(this.scene, this.camera);
            }, wait);
        };
    }

    // Cleanup method to remove listeners
    cleanup() {
        window.removeEventListener('resize', this.resizeDebounce);
        window.removeEventListener('orientationchange', this.resizeDebounce);
        this.resizeObserver.disconnect();
    }

    updateBots() {
        const maxPaddleY = this.config.board.height/2 - this.config.paddles.length/2 - this.config.board.wallWidth;
        const minPaddleY = -this.config.board.height/2 + this.config.paddles.length/2 - this.config.board.wallWidth;
        const paddleSpeed = this.ball.speed * this.config.paddles.controls.speed;
        const botConfig = this.config.paddles.controls.bots;

        // Fonction helper pour le mouvement du bot avec interpolation
        const movePaddleBot = (paddle, isLeft) => {
            // Prédiction de la position future de la balle
            const ballDirection = this.ball.direction;
            const ballSpeed = this.ball.speed;
            
            // Calculer le temps jusqu'à l'impact avec plus de précision
            const distanceX = isLeft ? 
                (paddle.mesh.position.x - this.ball.mesh.position.x) : 
                (this.ball.mesh.position.x - paddle.mesh.position.x);
            const timeToImpact = Math.abs(distanceX / (ballSpeed * ballDirection.x));

            // Si la balle se dirige vers le paddle
            if ((isLeft && ballDirection.x < 0) || (!isLeft && ballDirection.x > 0)) {
                // Calculer la position prédite avec erreur
                const predictionError = (Math.random() - 0.5) * 2 * botConfig.predictionError;
                
                // Utiliser une interpolation pour un mouvement plus fluide
                const predictedY = this.ball.mesh.position.y + 
                                 ballDirection.y * ballSpeed * timeToImpact * 
                                 (1 + predictionError);

                // Position cible avec interpolation
                const targetY = THREE.MathUtils.lerp(
                    paddle.mesh.position.y,
                    predictedY,
                    0.1 // Facteur de lissage
                );

                // Appliquer un délai de réaction
                if (Math.random() > botConfig.reactionDelay) {
                    // Calculer le nouveau déplacement avec limite de vitesse
                    const movement = Math.min(
                        paddleSpeed,
                        Math.abs(targetY - paddle.mesh.position.y)
                    ) * Math.sign(targetY - paddle.mesh.position.y);

                    // Appliquer le mouvement avec les limites
                    const newY = paddle.mesh.position.y + movement;
                    paddle.mesh.position.y = THREE.MathUtils.clamp(
                        newY,
                        minPaddleY,
                        maxPaddleY
                    );
                }
            } else {
                // Retour au centre plus fluide
                const centerY = 0;
                const movement = THREE.MathUtils.lerp(
                    paddle.mesh.position.y,
                    centerY,
                    0.05 // Facteur de lissage pour le retour au centre
                );
                
                paddle.mesh.position.y = movement;
            }
        };

        // Mise à jour des paddles bots
        if (this.config.paddles.controls.leftBot) {
            movePaddleBot(this.paddleLeft, true);
        }
        if (this.config.paddles.controls.rightBot) {
            movePaddleBot(this.paddleRight, false);
        }
    }
}