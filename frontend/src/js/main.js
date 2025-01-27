console.log("main script started");

window.addEventListener("DOMContentLoaded", () => {
    loadLoginPage();
  });
  
  function loadLoginPage() {
    const app = document.getElementById("app");
    app.innerHTML = `
      <div class="container d-flex justify-content-center align-items-center" style="height:100vh;">
        <button class="btn connect-btn" id="connectButton">CONNECT WITH 42</button>
      </div>
    `;
  }