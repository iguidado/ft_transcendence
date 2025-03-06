import * as THREE from 'three';
import { config } from './config.js';
import { ball } from './objects.js';
import { scoreMonitor } from './scoreMonitor.js';

export function game_loop() {
	ball.move()
	scoreMonitor()
}