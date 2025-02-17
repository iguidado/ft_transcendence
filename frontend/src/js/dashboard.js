
function loadDashboard() {
    const app = document.getElementById("app");
    app.innerHTML = `
      <div class="container d-flex flex-column justify-content-start align-items-center" style="height:100vh; padding-top: 50px;">
        <h2>Dashboard</h2>
        <p>Bienvenue dans le dashboard !</p>
        
        <div class="card mt-4 semi-transparent-card" style="width: 80%;">
          <div class="card-body">
            <h5 class="card-title">Resultats des parties</h5>
            <table class="table semi-transparent-table">
              <thead>
            <tr>
              <th scope="col">Joueur</th>
              <th scope="col">Score</th>
              <th scope="col">Date</th>
            </tr>
              </thead>
              <tbody>
            <tr>
              <td>Joueur 1</td>
              <td>1500</td>
              <td>2023-10-01</td>
            </tr>
            <tr>
              <td>Joueur 2</td>
              <td>1200</td>
              <td>2023-10-02</td>
            </tr>
            <tr>
              <td>Joueur 3</td>
              <td>1800</td>
              <td>2023-10-03</td>
            </tr>
              </tbody>
            </table>
          </div>
        </div>
        </div>
        
        <!-- Un bouton pour revenir à la page de logi-->
        <div class="position-fixed top-0 end-0 m-4">
        <button id="backToLogin" class="btn my-button">
          Retour Login
        </button>
        </div>
    `;
  
    //retourner au login
    const backBtn = document.getElementById("backToLogin");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        loadLoginPage();
      });
    }
  }