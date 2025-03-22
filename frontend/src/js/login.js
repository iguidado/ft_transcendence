import { loginRequest } from "./api/routes/loginRequest";

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
	console.log("hello");

  const app = document.getElementById("app");
  
  document.body.classList.add("themePink");
  
  await waitLoginAvailable();
    
    // -- Écouteur sur le formulaire de login --
    const loginForm = document.getElementById("loginForm");
    if (loginForm){
      console.log("hello");
      loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("emailInput").value;
        const password = document.getElementById("passwordInput").value;
        
        // Show loading state
        const submitButton = loginForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Logging in...';
      
		loginRequest({email, password})

        // try {
        //   const response = await fetch('http://127.0.0.1:8080/api/login/', {
        //     method: 'POST',
        //     credentials: 'include',
        //     headers: {
		// 		'Content-Type': 'application/json',
		// 	},
        //     body: JSON.stringify({
        //       email: emailValue,
        //       password: passValue,
        //     })
        //   });
      
        //   if (!response.ok) {
        //     const errorData = await response.json();
        //     throw new Error(errorData.message || 'Login failed');
        //   }
      
        //   const data = await response.json();
        //   console.log("Login successful:", data);
          
        //   // Store the token if returned
        //   if (data.token) {
        //     localStorage.setItem('authToken', data.token);
        //   }
          
        //   // Redirect to dashboard or home page
        //   // window.location.href = '/dashboard';
          
        // } catch (error) {
        //   console.error("Error:", error);
        //   let errorMessage = 'An error occurred during login';
          
        //   if (error.message === 'Failed to fetch') {
        //     errorMessage = 'Cannot connect to the server. Please check your internet connection.';
        //   }
          
        //   // Create or update error message element
        //   let errorElement = document.getElementById('login-error');
        //   if (!errorElement) {
        //     errorElement = document.createElement('div');
        //     errorElement.id = 'login-error';
        //     errorElement.style.color = 'red';
        //     loginForm.insertBefore(errorElement, submitButton);
        //   }
        //   errorElement.textContent = errorMessage;
        // } finally {
        //   // Reset button state
        //   submitButton.disabled = false;
        //   submitButton.textContent = originalButtonText;
        // }
      });
    }
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
