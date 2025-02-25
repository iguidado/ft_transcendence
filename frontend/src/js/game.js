function loadGame(){
    const app = document.getElementById("app");
    app.innerHTML = `
    <div class="container d-flex flex-column justify-content-start align-items-center" style="height:100vh; padding-top: 50px;">
    <h1 class="mb-4" style="font-size: 2.5rem;">Pongopolys</h1>
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
    
    const container = document.getElementById("gameContainer");
    let scene, camera, renderer, cube, material;
    let leftPaddle, rightPaddle, ball;
    let ballSpeedX = 0.05, ballSpeedY = 0.05;
    let paddleSpeed = 0.1;
    
    initScene();
    createObjects();
    addControls();
    animate();
    
    //gere le changement de taille de la fenetre
    window.addEventListener('resize', onWindowResize);

    //gestion taille responsive
    function onWindowResize(){
        const w = container.clientWidth;
        const h = container.clientHeight;
    
        renderer.setSize(w, h);
    
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }

    //faire que tout bouge
    function animate(){
        requestAnimationFrame(animate);
        update();
        renderer.render(scene, camera);
    }
    
    //creation du canva/scene etc
    function initScene(){
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({alpha: true});
        const width = container.clientWidth;
        const height = container.clientHeight;

        renderer.setSize(width, height);
        renderer.setClearColor(0xF03DAA, 0.5);
        container.appendChild(renderer.domElement);
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        camera.position.z = 5;
        // animate();
    }
    
    function createObjects(){
        //creation raquette 1 (gauche)
        const geomPaddle = new THREE.BoxGeometry(0.2, 1, 0.1);
        const matPaddle = new THREE.MeshBasicMaterial({color: 0xFEB486});
        paddleLeft = new THREE.Mesh(geomPaddle, matPaddle);
        paddleLeft.position.set(-2, 0, 0);
        scene.add(paddleLeft);

        //creation raquette 2 (droite)
        paddleRight = new THREE.Mesh(geomPaddle, matPaddle.clone());
        paddleRight.position.set(+2, 0, 0);
        scene.add(paddleRight);

        //creation balle
        const geomBall = new THREE.SphereGeometry(0.1, 16, 16);
        const matBall = new THREE.MeshBasicMaterial({color:0xfa75b1});
        ball = new THREE.Mesh(geomBall, matBall);
        scene.add(ball);
    }

    function addControls(){
        document.addEventListener('keydown', (e) => {
            if(e.key === 'w'){
                paddleRight.position.y += paddleSpeed;
            } else if (e.key === 's'){
                paddleRight.position.y -= paddleSpeed;
            }
        });
    }

    function update(){
        ball.position.x += ballSpeedX;
        ball.position.y += ballSpeedY;

        if(ball.position.y >= 2 || ball.position.y <= -2){
            ballSpeedY = -ballSpeedY;
        }

        if(ball.position.x >= 2 || ball.position.x <= -2){
            ballSpeedX = -ballSpeedX;
        }

        if(ball.position.x >= 1.8 && ball.position.x <= 2 && ball.position.y <= paddleRight.position.y + 0.5 && ball.position.y >= paddleRight.position.y - 0.5){
            ballSpeedX = -ballSpeedX;
        }

        if(ball.position.x <= -1.8 && ball.position.x >= -2 && ball.position.y <= paddleLeft.position.y + 0.5 && ball.position.y >= paddleLeft.position.y - 0.5){
            ballSpeedX = -ballSpeedX;
        }
    }
    
    // --------------GESTION BOUTONS ----------------------------
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