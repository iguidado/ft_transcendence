import { registerRequest } from "./api/routes/registerRequest";

// Registration form management, API connection etc.

function waitRegisterFormAvailable() {
  let interval;

  return new Promise((resolve) => {
    interval = setInterval(() => {
      if (document.getElementById("registerForm")) {
        clearInterval(interval);
        resolve();
      } else {
        console.log("Waiting for registerForm");
      }
    }, 300);
  });
}

export async function handleRegistration() {
  console.log("Initializing registration form");

  await waitRegisterFormAvailable();

  // -- Registration form handling --
  const registerForm = document.getElementById("registerForm");
  
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      // Get field values
      const username = registerForm.querySelector('input[placeholder="Choose your login"]').value;
      const password = registerForm.querySelector('input[placeholder="Choose your password"]').value;
      const confirm_password = registerForm.querySelector('input[placeholder="Confirm your password"]').value;
      
      // Client-side data validation
      if (!username || !password || !confirm_password) {
        showError("All fields are required");
        return;
      }
      
      if (password !== confirm_password) {
        showError("Passwords do not match");
        return;
      }
      
      // Show loading state
      const submitButton = registerForm.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = "Registering...";
      
        registerRequest({ username, password , confirm_password });
    });
  } else {
    console.error("The registerForm does not exist!");
  }
}
