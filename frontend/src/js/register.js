function loadRegister(){
    const app = document.getElementById("app");
    app.innerHTML = `
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Conteneur principal (hauteur max pour centrer verticalement) -->
    <div class="container d-flex flex-column justify-content-start align-items-center" style="height:100vh; padding-top: 50px;">
    <!-- Titre -->
    <h1 class="mb-4" style="font-size: 2.5rem;">REGISTER</h1>
    
    <!-- Formulaire -->
    <form id="loginForm" style="max-width: 400px; width: 100%;">
    <!-- Champ identifiant -->
    <div class="mb-3">
    <label for="loginInput" class="form-label" style="font-size: 1.25rem;">Login</label>
    <input 
    type="text" 
    class="form-control form-control-lg" 
    id="loginInput" 
    placeholder="Choose your login" 
    />
    </div>
    
    <!-- Password -->
    <div class="mb-3">
    <label for="passwordInput" class="form-label" style="font-size: 1.25rem;">Password</label>
    <input 
    type="password" 
    class="form-control form-control-lg" 
    id="passwordInput" 
    placeholder="Choose your password"
    />
    </div>
    <div class="mb-3">
    <label for="passwordInput" class="form-label" style="font-size: 1.25rem;">Password again</label>
    <input 
    type="password" 
    class="form-control form-control-lg" 
    id="passwordInput" 
    placeholder="Confirm your password"
    />
    </div>
    
    <!-- Bouton “Create account” -->
    <button type="submit" class="btn my-button btn-lg mt-4 w-100">
    CREATE ACCOUNT
    </button>
    </form>
  
      <!-- Bouton “BACK TO LOGIN” -->
    <button class="btn my-button btn-lg mt-4 w-80" id="backButton">
    BACK TO LOGIN
    </button>
    
    <!-- Bouton “Game” -->
      <div class="position-fixed top-0 start-0 m-4">
        <button class="btn my-button" id="gameButton">Game</button>
      </div>
  
    <!-- Bouton “Dashboard” -->
      <div class="position-fixed top-0 end-0 m-4">
        <button class="btn my-button" id="dashboardButton">Dashboard</button>
      </div>
    
    `;

    const gameBtn = document.getElementById("gameButton");
    gameBtn.addEventListener("click", () => {
      loadGame();
    });

    const dashboardBtn = document.getElementById("dashboardButton");
    dashboardBtn.addEventListener("click", () => {
      loadDashboard();
    });

    const backBtn = document.getElementById("backButton");
    backBtn.addEventListener("click", () => {
      loadLoginPage();
    });
}
