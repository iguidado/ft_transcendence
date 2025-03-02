import * as THREE from 'three';
import { Ball } from './Ball.js';
import { CollitionBox } from './CollitionBox.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

let ball = new Ball(scene, {speed: 0.01, direction: new THREE.Vector3(1, 0, 0)})

let collitionBoxes = [
	new CollitionBox(scene, {height: 0.5, width: 20, depth: 1, y: 5}),
	new CollitionBox(scene, {height: 0.5, width: 20, depth: 1, y: -5}),
	new CollitionBox(scene, {height: 15, width: 0.5, depth: 1, x: 8}),
	new CollitionBox(scene, {height: 15, width: 0.5, depth: 1, x: -8})
]

camera.position.z = 10;

function ball_engine() {
	let ray = new THREE.Ray(ball.ball.position.clone(), ball.direction.clone().normalize())
	let raycaster = new THREE.Raycaster();
	raycaster.ray = ray
	let intersects = raycaster.intersectObjects(scene.children)
	console.log("intersects:", intersects.length)
	intersects.forEach(obj => {
		console.log(obj.distance)
	})
}


let i = 0
function animate() {
	// ball.move()
	if (!i) {
		ball.displayDirectionVector(scene)
		ball_engine()
	}
	i++
	renderer.render( scene, camera );

}