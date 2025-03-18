import * as THREE from 'three'
import { CameraManager } from './CameraManager.js'
import { RendererManager } from './RendererManager.js'
import { gameRegistry } from './GameRegistry.js'

export class ViewManager {
    constructor() {
        this.game = gameRegistry.getCurrentContext()
        this.config = this.game.config
        this.views = []
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
        
        // Calculate number of views from presets array
        const numViews = this.config.views.cameraPresets ? this.config.views.cameraPresets.length : 0;
        
        // If we have no presets, don't try to create views
        if (numViews === 0) return;
        
        for (let i = 0; i < numViews; i++) {
            const viewElement = document.createElement('div');
            
            // Set width and height based on layout
            if (this.config.views.layout === 'horizontal') {
                // For horizontal layout, divide width by number of views
                viewElement.style.width = `${100 / numViews}%`;
                viewElement.style.height = '100%';
            } else if (this.config.views.layout === 'vertical') {
                // For vertical layout, divide height by number of views
                viewElement.style.width = '100%';
                viewElement.style.height = `${100 / numViews}%`;
            } else {
                // For grid layout, calculate based on square root
                const columns = Math.ceil(Math.sqrt(numViews));
                viewElement.style.width = `${100 / columns}%`;
                viewElement.style.height = `${100 / Math.ceil(numViews / columns)}%`;
            }
            
            // Add a subtle border to see the separation
            viewElement.style.boxSizing = 'border-box';
            viewElement.style.position = 'relative';
            
            this.game.container.appendChild(viewElement);

            // Add the view with the corresponding preset
            const cameraConfig = this.config.views.cameraPresets[i] || {};
            this.createView(viewElement, cameraConfig);
        }
    }

    createView(container, cameraConfig = {}) {
        const view = {
            container,
            cameraManager: new CameraManager(this.game, container, cameraConfig),
            rendererManager: new RendererManager(this.game, container)
        }
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
            view.rendererManager.handleResize()
            view.cameraManager.init()
        }
    }

    cleanup() {
        for (const view of this.views) {
            view.rendererManager.cleanup()
        }
    }
}