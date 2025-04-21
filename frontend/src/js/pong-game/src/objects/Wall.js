import * as THREE from "three"
import { gameRegistry } from "../core/GameRegistry.js";

export class Wall {
    constructor({height, width, depth, x, y, color, texturePath} = {}) {
        const context = gameRegistry.getCurrentContext();
        this.height = height || 0
        this.width = width || 0
        this.depth = depth || 0
        this.color = color || 0x0000ff
        this.geometry = new THREE.BoxGeometry(this.width, this.height, this.depth)
        
        if (texturePath) {
            const textureLoader = new THREE.TextureLoader();
            
            const onLoad = (texture) => {
                texture.wrapS = THREE.RepeatWrapping; 
                texture.wrapT = THREE.ClampToEdgeWrapping; 
                
                texture.repeat.set(5, 1);
                texture.offset.set(0, 0);
                texture.center.set(0, 0);
                
                this.material = new THREE.MeshBasicMaterial({ 
                    map: texture,
                    transparent: true
                });
                
                this.mesh.material = this.material;
            };
            
            const onError = (err) => {
                this.material = new THREE.MeshBasicMaterial({ color: this.color });
                this.mesh.material = this.material;
            };
            
            try {
                textureLoader.load(texturePath, onLoad, undefined, onError);
            } catch (error) {
                this.material = new THREE.MeshBasicMaterial({ color: this.color });
            }
        } else {
            this.material = new THREE.MeshBasicMaterial({ color: this.color });
        }
        
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        
        if (x)
            this.mesh.position.x = x
        if (y)
            this.mesh.position.y = y
        context.scene.add(this.mesh)
    }
}