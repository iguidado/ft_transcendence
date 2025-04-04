import { handleRegistration } from "./register";
import { loginForm } from "./login_page/loginForm";

export function loadLoginPage() {
	// const app = document.getElementById("app");
	loginForm();
	const registerBtn = document.getElementById("registerButton");
	if (registerBtn) {
		registerBtn.addEventListener("click", () => {
			showRegister();
		});
	}
	// TODO “CONNECT WITH 42”
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
