import * as THREE from 'three'
import { Ball } from './Ball.js'
import { CollitionBox } from './CollitionBox.js'
import { scene, camera } from './globals.js'
import { addLine } from './tools.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer()
renderer.setSize( window.innerWidth, window.innerHeight )
renderer.setAnimationLoop( animate )
document.body.appendChild( renderer.domElement )

let ball = new Ball({speed: 0.01, direction: new THREE.Vector3(1, -0.5, 0)})

let walls = [
	new CollitionBox(scene, {height: 0.5, width: 20, depth: 2, y: 5}),
	new CollitionBox(scene, {height: 0.5, width: 20, depth: 2, y: -5}),
	new CollitionBox(scene, {height: 15, width: 0.5, depth: 2, x: 8}),
	new CollitionBox(scene, {height: 15, width: 0.5, depth: 2, x: -8})
]

camera.position.z = 10


// Ajouter les contrôles de la caméra (OrbitControls)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Activer le lissage pour un contrôle plus fluide
controls.dampingFactor = 0.25; // Facteur de lissage
controls.screenSpacePanning = false; // Empêche le pan dans l'espace écran
// controls.maxPolarAngle = Math.PI / 2; // Limite l'angle de rotation sur l'axe vertical


let i = 0
function animate() {
	// ball.move()
	if (!i) {
		// ball.displayDirectionVector()
		ball.raycaster()
	}
	controls.update();
	i++
	renderer.render( scene, camera )

}