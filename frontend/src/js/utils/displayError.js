
export function displayError(message) {
    const messageElement = document.getElementById("errorMessage");
    messageElement.textContent = message;
  
    const modalElement = document.getElementById("errorModal");
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
  