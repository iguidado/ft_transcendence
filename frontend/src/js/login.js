import { load_page } from "./router";
import { handleRegistration } from "./register";
import { loginRequest } from "./api/routes/loginRequest";

export function loadLoginPage() {
  const app = document.getElementById("app");
  

    // -- Écouteur sur le formulaire de login --
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault(); // Empêche la soumission réelle et le rechargement de page
      const loginValue = document.getElementById("loginInput").value;
      const passValue = document.getElementById("passwordInput").value;
      // console.log("Tentative de connexion :", loginValue, passValue);
              loginRequest(
                { 
                  username: loginValue,
                  password: passValue
                },
                (res) => {
                  console.log(res);
                  const valide2FAsection = document.getElementById('2FALoginModal');
                  console.log(valide2FAsection);
                  valide2FAsection.style.display = 'block';
                  // if (validate2FAFromLogin.addEventListener('click', () => {load_page('profile');}))
                  //   load_page('profile');
                },
                (err) => {
                  console.error("Register Error", err);
              });
      
      // (avec un fetch vers le back ou un mock) et rediriger (ex : loadDashboard())
    });
    
  // -- Écouteur sur le bouton “CONNECT WITH 42” (au besoin) --
  // document.getElementById("connectButton").addEventListener("click", () => {
  //   // console.log("Connexion via 42 OAuth (à implémenter).");
  //   // plus tard => loadDashboard() ou autre
  // });


// -- Écouteur sur le bouton “REGISTER” --
  const registerBtn = document.getElementById("registerButton");
  if (registerBtn) {
    registerBtn.addEventListener("click", () => {
      // console.log("Clic sur le bouton REGISTER");
      showRegister(); 
    });
}


  // -- ecouteur sur le bouton Back to Login
  const backToLoginBtn = document.getElementById("backToLoginButton");
  if (backToLoginBtn) {
    backToLoginBtn.addEventListener("click", () => {
      // console.log("Clic sur le bouton BACK TO LOGIN");
      showLogin();
    });
  }
}



export function showRegister() {
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("registerSection").style.display = "block";
  handleRegistration();
  
}

export function showLogin() {
  document.getElementById("loginSection").style.display = "block";
  document.getElementById("registerSection").style.display = "none";
}


// export function validate2FA() {
//   const twoFACode = document.getElementById('twoFACodeInput').value;

//   // Si tu veux fermer le modal après validation manuelle
//   // 1) Récupérer l'instance du modal
//   const myModal = document.getElementById('twoFAModal');
//   const modalInstance = bootstrap.Modal.getInstance(myModal);
//   // 2) on le ferme
//   modalInstance.hide();

//   // suite: rediriger ou activer la 2FA etc.
// }