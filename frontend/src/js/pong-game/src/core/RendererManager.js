import * as THREE from 'three'
import { gameRegistry } from './GameRegistry'
import { ScoreMonitor } from './ScoreMonitor'

export class RendererManager {
    constructor(game, container) {
        this.game = game;
        this.container = container;
        this.context = gameRegistry.getCurrentContext();
        this.config = this.context.config;
        
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        
        this.renderer.setClearColor(0x000000, 1);
        
        // Get initial dimensions
        const width = this.container.clientWidth || 1;  // Prevent zero width
        const height = this.container.clientHeight || 1; // Prevent zero height
        
        this.renderer.setSize(width, height, false); // false = don't update style
        
        // Set renderer element to fill container precisely
        this.renderer.domElement.style.display = 'block';
        this.renderer.domElement.style.width = '100%';
        this.renderer.domElement.style.height = '100%';
        
        this.container.appendChild(this.renderer.domElement);

        // Debounce setup for resize
        this.resizeDebounce = this.debounce(() => this.handleResize(), 16); 
        
        window.addEventListener('resize', this.resizeDebounce);
        this.resizeObserver = new ResizeObserver(this.resizeDebounce);
        this.resizeObserver.observe(this.container);
        window.addEventListener('orientationchange', this.resizeDebounce);

        this.scoreMonitor = new ScoreMonitor();
        
        // Initial size setup
        this.handleResize();
    }

    render(scene, camera) {
        // Safety check - only render if both scene and camera are properly initialized
        if (scene && camera && camera.matrixWorldAutoUpdate !== undefined) {
            this.scoreMonitor.update();
            this.renderer.render(scene, camera);
        }
    }

    debounce(func, wait) {
        let timeout
        return (...args) => {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                func.apply(this, args)
            }, wait)
        }
    }

    handleResize() {
        // Get dimensions, ensure they're never zero
        const width = Math.max(1, this.container.clientWidth);
        const height = Math.max(1, this.container.clientHeight);
        
        // Update renderer size with pixelRatio for proper resolution
        this.renderer.setSize(width, height, false);
    }

    cleanup() {
        window.removeEventListener('resize', this.resizeDebounce);
        window.removeEventListener('orientationchange', this.resizeDebounce);
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
            this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
        }
    }
}