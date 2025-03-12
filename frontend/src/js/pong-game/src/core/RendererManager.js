import * as THREE from 'three'
import { gameRegistry } from './GameRegistry'
import { ScoreMonitor } from './ScoreMonitor'

export class RendererManager {
	constructor() {
		this.context = gameRegistry.getCurrentContext()
		this.config = this.context.config
		this.renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true
		})
		this.renderer.setClearColor(0x000000, 0)
		this.renderer.setSize(this.context.container.clientWidth, this.context.container.clientHeight)
		this.context.container.appendChild(this.renderer.domElement)

		// Debounce le resize pour de meilleures performances
		this.resizeDebounce = this.debounce(() => this.handleResize(), 16) // environ 60fps

		// Gestionnaire de redimensionnement optimisé
		window.addEventListener('resize', this.resizeDebounce)
		// Observer les changements de taille du container
		this.resizeObserver = new ResizeObserver(this.resizeDebounce)
		this.resizeObserver.observe(this.context.container)
		// Gestionnaire d'orientation
		window.addEventListener('orientationchange', this.resizeDebounce)

		this.scoreMonitor = new ScoreMonitor();
        
        // Optional: Add score display update
        this.scoreMonitor.setScoreCallback((scores) => {
            // Update score display if needed
            console.log('Score update:', scores);
        });
	}
	render() {
		this.scoreMonitor.update();
		this.renderer.render(this.context.scene, this.context.cameraManager.camera)
	}
	debounce(func, wait) {
		let timeout
        return (...args) => {
            this.render(this.scene, this.camera)
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                func.apply(this, args)
                this.render(this.scene, this.camera)
            }, wait)
        }
    }
	handleResize() {
        const width = this.context.container.clientWidth
        const height = this.context.container.clientHeight
        this.renderer.setSize(width, height)
	}
}