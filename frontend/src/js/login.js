
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
}

// === Au chargement, on lance loadLoginPage ===
window.addEventListener("DOMContentLoaded", () => {
  loadLoginPage();
});


function showRegister() {
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("registerSection").style.display = "block";
}

function showLogin() {
  document.getElementById("loginSection").style.display = "block";
  document.getElementById("registerSection").style.display = "none";
}
