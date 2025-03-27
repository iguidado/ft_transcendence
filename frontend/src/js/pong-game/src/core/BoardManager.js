import * as THREE from 'three'
import { gameRegistry } from './GameRegistry.js'
import { Wall } from '../objects/Wall.js'
import { Paddle } from '../objects/Paddle.js'
import { Ball } from '../objects/Ball.js'

export class BoardManager {
    constructor() {
        this.context = gameRegistry.getCurrentContext()
        this.config = this.context.config
        this.boardGroup = new THREE.Group()
        this.context.scene.add(this.boardGroup)
		this.wallTop = new Wall({
			height: this.config.board.wallWidth,
			width: this.config.board.width + this.config.board.wallWidth,
			depth: this.config.board.depth,
			y: this.config.board.height/2,
			texturePath: "../../../../rsc/pongTextures/wallTex.png"
		})
	
		this.wallBottom = new Wall({
			height: this.config.board.wallWidth,
			width: this.config.board.width + this.config.board.wallWidth,
			depth: this.config.board.depth,
			y: -this.config.board.height/2,
			texturePath: "../../../../rsc/pongTextures/wallTex.png"
		})
	
		this.paddleLeft = new Paddle({ isLeft: true, color: 0x0000ff })
		this.paddleRight = new Paddle({ isLeft: false })
		this.ball = new Ball()
	
		this.boardGroup.add(this.wallTop.mesh)
		this.boardGroup.add(this.wallBottom.mesh)
		this.boardGroup.add(this.paddleLeft.mesh)
		this.boardGroup.add(this.paddleRight.mesh)
		this.boardGroup.add(this.ball.mesh)
    }
}