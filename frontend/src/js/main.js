console.log("main script started");

// === Thèmes & changement de thèmes ===
let currentThemeIndex = 0;
const themes = ["theme1", "theme2", "theme3", "theme4"];

function setNewTheme() {
  // On retire toutes les classes de thème précédentes
  document.body.classList.remove(...themes);

  // On applique la nouvelle classe
  document.body.classList.add(themes[currentThemeIndex]);
  
  currentThemeIndex++;
  if (currentThemeIndex >= themes.length) {
    currentThemeIndex = 0;
  }
}

// === Fonction pour charger la page de login ===
function loadLoginPage() {
  const app = document.getElementById("app");

  // Injection HTML : formulaire + bouton "CONNECT" + bouton "Surprise"
  app.innerHTML = `
    <!-- Conteneur principal (hauteur max pour centrer verticalement) -->
    <div class="container d-flex flex-column justify-content-center align-items-center" style="height:100vh;">
      <!-- Titre -->
      <h2 class="mb-4">Connexion</h2>

      <!-- Formulaire -->
      <form id="loginForm" style="max-width: 300px; width: 100%;">
        <!-- Champ identifiant -->
        <div class="mb-3">
          <label for="loginInput" class="form-label">Identifiant</label>
          <input 
            type="text" 
            class="form-control" 
            id="loginInput" 
            placeholder="Entrez votre identifiant" 
          />
        </div>

        <!-- Champ mot de passe -->
        <div class="mb-3">
          <label for="passwordInput" class="form-label">Mot de passe</label>
          <input 
            type="password" 
            class="form-control" 
            id="passwordInput" 
            placeholder="Entrez votre mot de passe"
          />
        </div>

        <!-- Bouton “Se connecter” -->
        <button type="submit" class="btn btn-primary w-100">
          Se connecter
        </button>
      </form>

      <!-- Bouton “CONNECT WITH 42” -->
      <button class="btn connect-btn mt-4" id="connectButton">
        CONNECT WITH 42
      </button>
    </div>

    <!-- Bouton “Surprise” en bas à droite -->
    <div class="position-fixed bottom-0 end-0 m-4">
      <button class="btn my-button" id="themeButton"></button>
    </div>
  `;

  // -- Écouteur sur le bouton "Surprise" --
  document.getElementById("themeButton").addEventListener("click", () => {
    setNewTheme();
  });

  // -- Écouteur sur le formulaire de login (submit) --
  const loginForm = document.getElementById("loginForm");
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Empêche la soumission réelle et le rechargement de page
    const loginValue = document.getElementById("loginInput").value;
    const passValue = document.getElementById("passwordInput").value;
    console.log("Tentative de connexion :", loginValue, passValue);

    // Ici, tu pourras plus tard vérifier les identifiants 
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