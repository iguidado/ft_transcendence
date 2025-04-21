import * as THREE from 'three'
import { CameraManager } from './CameraManager.js'
import { RendererManager } from './RendererManager.js'
import { gameRegistry } from './GameRegistry.js'

export class ViewManager {
    constructor() {
        this.game = gameRegistry.getCurrentContext()
        this.config = this.game.config
        this.views = []
        if (!this.config.views)
            this.config.views = {}
        if (!this.config.views.cameraPresets || !this.config.views.cameraPresets.length)
            this.config.views.cameraPresets = [{}]
        if (this.config.views.containerFitting === undefined)
            this.config.views.containerFitting = false
        this.init()
    }

    createDefaultContainer() {
        this.game.container = document.createElement('div');
        this.game.container.style.width = '100%';
        this.game.container.style.height = '100vh';
        this.game.container.style.display = 'flex';

        if (this.config.views.layout === 'horizontal') {
            this.game.container.style.flexDirection = 'row';
        } else if (this.config.views.layout === 'vertical') {
            this.game.container.style.flexDirection = 'column';
        } else {
            this.game.container.style.flexWrap = 'wrap';
        }
        document.body.appendChild(this.game.container);
    }
	
    init() {
        if (!this.game.container) {
            this.createDefaultContainer();
        }
        
        const numViews = this.config.views.cameraPresets ? this.config.views.cameraPresets.length : 0;
        
        if (numViews === 0) return;
        
        for (let i = 0; i < numViews; i++) {
            const viewElement = document.createElement('div');
            viewElement.classList.add("pong-view-element");
            
            if (this.config.views.layout === 'horizontal') {
                viewElement.style.width = `${100 / numViews}%`;
                viewElement.style.height = '100%';
            } else if (this.config.views.layout === 'vertical') {
                viewElement.style.width = '100%';
                viewElement.style.height = `${100 / numViews}%`;
            } else {
                const columns = Math.ceil(Math.sqrt(numViews));
                viewElement.style.width = `${100 / columns}%`;
                viewElement.style.height = `${100 / Math.ceil(numViews / columns)}%`;
            }
            
            viewElement.style.boxSizing = 'border-box';
            viewElement.style.position = 'relative';
            
            this.game.container.appendChild(viewElement);

            const cameraConfig = this.config.views.cameraPresets[i] || {};
            this.createView(viewElement, cameraConfig);

            setTimeout(() => this.fitContainerToBoard(viewElement), 0);
        }
    }

    createView(container, cameraConfig = {}) {
        const view = {
            container,
            cameraManager: new CameraManager(this.game, container, cameraConfig),
            rendererManager: new RendererManager(this.game, container)
        }
        this.fitContainerToBoard(container);
        view.cameraManager.init()
        this.views.push(view)
        return view
    }

    render() {
        for (const view of this.views) {
            view.rendererManager.render(this.game.scene, view.cameraManager.camera)
        }
    }

    handleResize() {
        for (const view of this.views) {
            this.fitContainerToBoard(view.container);
            view.rendererManager.handleResize()
            view.cameraManager.init()
        }
    }

    cleanup() {
		for (const view of this.views) {
			view.rendererManager.cleanup();
			if (view.container && view.container.parentNode) {
				view.container.parentNode.removeChild(view.container);
			}
		}
		
		this.views = [];
	}

    fitContainerToBoard(container) {
        if (!this.config.views.containerFitting) return;

        const boardWidth = this.config.board.width;
        const boardHeight = this.config.board.height;
        const boardAspectRatio = boardWidth / boardHeight;

        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        const containerAspectRatio = containerWidth / containerHeight;

        if (containerAspectRatio > boardAspectRatio) {
            const newWidth = containerHeight * boardAspectRatio;
            container.style.width = `${newWidth}px`;
            container.style.height = `${containerHeight}px`;
            container.style.margin = "0 auto";
        } else {
            const newHeight = containerWidth / boardAspectRatio;
            container.style.height = `${newHeight}px`;
            container.style.width = `${containerWidth}px`;
            container.style.margin = "auto 0";
        }
    }
}