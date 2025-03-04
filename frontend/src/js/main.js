
function loadLoginPage() {
  const app = document.getElementById("app");
  
  document.body.classList.add("themePink");
  
  app.innerHTML = `
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Conteneur principal (hauteur max pour centrer verticalement) -->
    <div class="container d-flex flex-column justify-content-start align-items-center" style="height:100vh; padding-top: 50px;">
    <!-- Titre -->
    <h1 class="mb-4" style="font-size: 2.5rem;">CONNECTION</h1>
    
    <!-- Formulaire -->
    <form id="loginForm" style="max-width: 400px; width: 100%;">
    <!-- Champ identifiant -->
    <div class="mb-3">
    <label for="loginInput" class="form-label" style="font-size: 1.25rem;">Login</label>
    <input 
    type="text" 
    class="form-control form-control-lg" 
    id="loginInput" 
    placeholder="Enter your login" 
    />
    </div>
    
    <!-- Password -->
    <div class="mb-3">
    <label for="passwordInput" class="form-label" style="font-size: 1.25rem;">Password</label>
    <input 
    type="password" 
    class="form-control form-control-lg" 
    id="passwordInput" 
    placeholder="Enter your password"
    />
    </div>
    
    <!-- Bouton “Connect” -->
    <button type="submit" class="btn my-button btn-lg mt-4 w-100">
    Connect
    </button>
    </form>

      <!-- Bouton “REGISTER” -->
    <button class="btn my-button btn-lg mt-4 w-80" id="registerButton">
    REGISTER
    </button>

    
    <!-- Bouton “CONNECT WITH 42” -->
    <button class="btn my-button btn-lg mt-4 w-80" id="connectButton">
    CONNECT WITH 42
    </button>
    </div>
    
    <!-- Boutons Game Dasboard Profile ensembles-->
      <div id="building">
        <button class="btn my-button" id="gameButton">Game</button>
        <button class="btn my-button" id="dashboardButton">Dashboard</button>
        <button class="btn my-button" id="profileButton">Profile</button>
      </div>
    
    `;

	async function fetchHTMLContent(url) {
		try {
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const htmlContent = await response.text();
			// console.log(htmlContent); // Affiche le contenu HTML dans la console
			return htmlContent;
		} catch (error) {
			console.error('Erreur lors de la récupération du fichier HTML:', error);
		}
	}

	function load_page(url) {
		fetchHTMLContent(url).then(htmlContent => {
			document.getElementById('app').innerHTML = htmlContent;
		});
	}

  const dashboardBtn = document.getElementById("dashboardButton");
  dashboardBtn.addEventListener("click", () => {
    load_page("./dashboard.html")
    
  });

  const profileBtn = document.getElementById("profileButton");
  profileBtn.addEventListener("click", () => {
    // On appelle la fonction loadProfile() du fichier profil.js
    loadProfile();
  });

  const registerBtn = document.getElementById("registerButton");
  registerBtn.addEventListener("click", () => {
    // On appelle la fonction loadRegister() du fichier register.js
    loadRegister();
  });

  const gameBtn = document.getElementById("gameButton");
  gameBtn.addEventListener("click", () => {
    // On appelle la fonction loadGame du fichier game.js
    loadGame();
  });

  
    
    // -- Écouteur sur le formulaire de login --
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault(); // Empêche la soumission réelle et le rechargement de page
      const loginValue = document.getElementById("loginInput").value;
      const passValue = document.getElementById("passwordInput").value;
      console.log("Tentative de connexion :", loginValue, passValue);
      
      // (avec un fetch vers le back ou un mock) et rediriger (ex : loadDashboard())
    });
    
  // -- Écouteur sur le bouton “CONNECT WITH 42” (au besoin) --
  document.getElementById("connectButton").addEventListener("click", () => {
    console.log("Connexion via 42 OAuth (à implémenter).");
    // plus tard => loadDashboard() ou autre
  });
}

// === Au chargement, on lance loadLoginPage ===
window.addEventListener("DOMContentLoaded", () => {
  loadLoginPage();
});