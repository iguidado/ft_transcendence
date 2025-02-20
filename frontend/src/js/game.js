function loadGame(){
    const app = document.getElementById("app");
    app.innerHTML = `
    <div class="container d-flex flex-column justify-content-start align-items-center" style="height:100vh; padding-top: 50px;">
    <h1 class="mb-4" style="font-size: 2.5rem;">Game</h1>
    <div id="gameContainer"></div>
    </div>


      <!-- Bouton “Dashboard” -->
    <div class="position-fixed top-0 start-0 m-4">
      <button class="btn my-button" id="dashboardButton">Dashboard</button>
    </div>

    <!-- Un bouton pour revenir à la page de log-->
    <div class="position-fixed top-0 end-0 m-4">
    <button id="backToLogin" class="btn my-button">
        Back to Login
        </button>
        </div>
        `;
    
    let scene, camera, renderer, cube, material, geometry;
    const container = document.getElementById("gameContainer");
        
    function animate(){
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
        
    function init3D(){
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({alpha: true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0xF03DAA, 0.5);
        container.appendChild(renderer.domElement);
        
        //TESTS
        geometry = new THREE.BoxGeometry(3, 1, 3);
        material = new THREE.MeshBasicMaterial();
        material.color.set(0xffbe5b);
        cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        camera.position.z = 5;

        animate();
    }

    init3D();

    const backBtn = document.getElementById("backToLogin");
    if (backBtn) {
        backBtn.addEventListener("click", () => {
        loadLoginPage();
        });
    }

    const dashBtn = document.getElementById("dashboardButton");
    dashBtn.addEventListener("click", () => {
        loadDashboard();
    });

}

// === Au f5, on revient sur la meme page parce que flemme de cliquer ===
window.addEventListener("DOMContentLoaded", () => {
    loadGame();
  });