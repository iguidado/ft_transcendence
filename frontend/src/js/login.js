
export function loadLoginPage() {
  const app = document.getElementById("app");
  
  document.body.classList.add("themePink");
  

    
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



export function showRegister() {
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("registerSection").style.display = "block";
}

export function showLogin() {
  document.getElementById("loginSection").style.display = "block";
  document.getElementById("registerSection").style.display = "none";
}


export function validate2FA() {
  const twoFACode = document.getElementById('twoFACodeInput').value;

  // Par exemple, tu fais un fetch vers le back
  console.log("2FA code saisi:", twoFACode);

  // Si tu veux fermer le modal après validation manuelle
  // 1) Récupérer l'instance du modal
  const myModal = document.getElementById('twoFAModal');
  const modalInstance = bootstrap.Modal.getInstance(myModal);
  // 2) on le ferme
  modalInstance.hide();

  // suite: rediriger ou activer la 2FA etc.
}
