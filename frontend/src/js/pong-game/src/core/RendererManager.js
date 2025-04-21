import * as THREE from 'three'
import { gameRegistry } from './GameRegistry.js'

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
        
        this.renderer.setClearColor(0xF03DAA, 0);
        
        const width = this.container.clientWidth || 1;
        const height = this.container.clientHeight || 1;
        
        this.renderer.setSize(width, height, false);
        
        this.renderer.domElement.style.display = 'block';
        this.renderer.domElement.style.width = '100%';
        this.renderer.domElement.style.height = '100%';
        
        this.container.appendChild(this.renderer.domElement);

        this.resizeDebounce = this.debounce(() => this.handleResize(), 16); 
        
        window.addEventListener('resize', this.resizeDebounce);
        this.resizeObserver = new ResizeObserver(this.resizeDebounce);
        this.resizeObserver.observe(this.container);
        window.addEventListener('orientationchange', this.resizeDebounce);
        
        this.handleResize();
    }

    render(scene, camera) {
        if (scene && camera && camera.matrixWorldAutoUpdate !== undefined) {
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
        const width = Math.max(1, this.container.clientWidth);
        const height = Math.max(1, this.container.clientHeight);
        
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