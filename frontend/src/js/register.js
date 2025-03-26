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
      const email = registerForm.querySelector('input[placeholder="Enter your mail"]').value;
      const password = registerForm.querySelector('input[placeholder="Choose your password"]').value;
      const confirm_password = registerForm.querySelector('input[placeholder="Confirm your password"]').value;
      
      // Client-side data validation
      if (!username || !email || !password || !confirm_password) {
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
      
    //   try {
        // Call the API function for registration
        registerRequest({ username, email, password , confirm_password });
        
        // console.log("Registration successful:", result);
        
        // Show success message
        // showSuccess("Your account has been created successfully!");
        
        // Redirect to login page after a short delay
        // setTimeout(() => {
        //   showLogin(); // Existing function to return to the login page
        // }, 2000);
        
    //   } catch (error) {
    //     console.error("Registration error:", error);
    //     showError(error.message || "An error occurred during registration");
    //   } finally {
    //     // Reset button state
    //     submitButton.disabled = false;
    //     submitButton.textContent = originalButtonText;
    //   }
    });
  } else {
    console.error("The registerForm does not exist!");
  }
}
