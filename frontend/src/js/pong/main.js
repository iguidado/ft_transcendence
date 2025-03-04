import * as THREE from 'three';
import { game_loop } from './game_loop.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { camera } from "./camera.js";
import { scene } from './scene.js';

export const renderer = new THREE.WebGLRenderer()
renderer.setSize( window.innerWidth, window.innerHeight )
renderer.setAnimationLoop( animate )
document.body.appendChild( renderer.domElement )

// Ajouter les contrôles de la caméra (OrbitControls)
const camera_controls = new OrbitControls(camera, renderer.domElement);
camera_controls.enableDamping = true; // Activer le lissage pour un contrôle plus fluide
camera_controls.dampingFactor = 0.25; // Facteur de lissage
camera_controls.screenSpacePanning = false; // Empêche le pan dans l'espace écran
// camera_controls.maxPolarAngle = Math.PI / 2; // Limite l'angle de rotation sur l'axe vertical

function animate() {
	game_loop()
	camera_controls.update();
	renderer.render( scene, camera )
}