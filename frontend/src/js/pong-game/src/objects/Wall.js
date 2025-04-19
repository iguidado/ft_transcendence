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
        
        // Utiliser une texture si fournie
        if (texturePath) {
            const textureLoader = new THREE.TextureLoader();
            
            // Fonction à exécuter lorsque la texture est chargée avec succès
            const onLoad = (texture) => {
                // Configure la texture pour se répéter
                texture.wrapS = THREE.RepeatWrapping; // Répétition horizontale (largeur/longueur)
                texture.wrapT = THREE.ClampToEdgeWrapping; // Pas de répétition verticale (hauteur)
                
                // Définit le nombre de répétitions horizontales et étire verticalement
                texture.repeat.set(5, 1); // 5 répétitions sur la largeur, pas de répétition en hauteur
                
                // Mise à l'échelle de la texture pour couvrir toute la hauteur
                texture.offset.set(0, 0);
                texture.center.set(0, 0);
                
                this.material = new THREE.MeshBasicMaterial({ 
                    map: texture,
                    transparent: true
                });
                
                // Appliquer le nouveau matériau au mesh
                this.mesh.material = this.material;
            };
            
            // Fonction à exécuter en cas d'erreur de chargement
            const onError = (err) => {
                // Utiliser le matériau par défaut en cas d'erreur
                this.material = new THREE.MeshBasicMaterial({ color: this.color });
                this.mesh.material = this.material;
            };
            
            // Chargement de la texture avec les gestionnaires d'erreur
            try {
                textureLoader.load(texturePath, onLoad, undefined, onError);
            } catch (error) {
                this.material = new THREE.MeshBasicMaterial({ color: this.color });
            }
        } else {
            this.material = new THREE.MeshBasicMaterial({ color: this.color });
        }
        
        // Créer le mesh avec un matériau temporaire qui sera remplacé après le chargement
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        
        if (x)
            this.mesh.position.x = x
        if (y)
            this.mesh.position.y = y
        context.scene.add(this.mesh)
    }
}