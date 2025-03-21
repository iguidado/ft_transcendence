import { load_page } from "./router";

function waitLoginAvailable()
{
  let interval;

  return (
    new Promise((resolve) =>
    {
      interval = setInterval(() => {
        if (document.getElementById("loginForm")){
          clearInterval(interval);
          resolve();
        }
        else{
          console.log("En attente de loginForm");
        }
      }, 300);
    })
  );
}

async function loadLoginPage() {
  const app = document.getElementById("app");
  
  document.body.classList.add("themePink");
  
  await waitLoginAvailable();
    
    // -- Écouteur sur le formulaire de login --
    const loginForm = document.getElementById("loginForm");
    if (loginForm){
      console.log("hello");
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault(); // Empêche la soumission réelle et le rechargement de page
        const emailValue = document.getElementById("emailInput").value;
        const passValue = document.getElementById("passwordInput").value;
        console.log("Tentative de connexion :", emailValue, passValue);
      
        fetch('http://127.0.0.1:9999/api/login/', {
          method: 'POST',
          headers : {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: emailValue,
            password: passValue,
         })
       })
        .then(response => {
          if (!response.ok) {
            throw new Error("Login failure");
          }
          return response.json();
        })
        .then(data => {
          console.log("Log success :", data);
        })
        .catch(error => {
          console.error("Erreur :", error)
          alert("Error during login")
        });
      // (avec un fetch vers le back ou un mock) et rediriger (ex : loadDashboard())
    });}
    else {
      console.error("Le formulaire loginForm n'existe pas !");
    }
    
  // -- Écouteur sur le bouton “CONNECT WITH 42” (au besoin) --
  document.getElementById("connectButton").addEventListener("click", () => {
    console.log("Connexion via 42 OAuth (à implémenter).");
    // plus tard => loadDashboard() ou autre
  });


// -- Écouteur sur le bouton “REGISTER” --
  const registerBtn = document.getElementById("registerButton");
  if (registerBtn) {
    registerBtn.addEventListener("click", () => {
      console.log("Clic sur le bouton REGISTER");
      showRegister(); 
    });
}

// -- Écouteur sur le bouton “CONNECT” -- FETCH ICI POUR SE CONNECTER
  const loginBtn = document.getElementById("connectButton");
  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      console.log("Clic sur le bouton LOGIN");
      load_page('profile');
    });
  }

  // -- ecouteur sur le bouton Back to Login
  const backToLoginBtn = document.getElementById("backToLoginButton");
  if (backToLoginBtn) {
    backToLoginBtn.addEventListener("click", () => {
      console.log("Clic sur le bouton BACK TO LOGIN");
      showLogin();
    });
  }
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
