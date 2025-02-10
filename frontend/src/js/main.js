console.log("main script started");

let currentThemeIndex = 0;
const themes = ["theme1", "theme2", "theme3", "theme4"];

function setNewTheme() {
  document.body.classList.remove(...themes);

  document.body.classList.add(themes[currentThemeIndex]);
  
  currentThemeIndex++;

  // Si on dépasse le dernier index, on revient à 0
  if (currentThemeIndex >= themes.length) {
    currentThemeIndex = 0;
  }
}
function loadLoginPage() {
  const app = document.getElementById("app");
  app.innerHTML = `
<div class="container d-flex justify-content-center align-items-center" style="height:100vh;">
  <button class="btn connect-btn mb-3" id="connectButton">CONNECT WITH 42</button>
</div>

<div class="position-fixed bottom-0 end-0 m-4">
  <button class="btn my-button" id="themeButton">Surprise</button>
</div>
  `;
  document.getElementById("themeButton").addEventListener("click", () => {
    setNewTheme();
  });
}

window.addEventListener("DOMContentLoaded", () => {
    loadLoginPage();
  });

