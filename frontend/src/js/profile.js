function loadProfile(){
    const app = document.getElementById("app");

    document.body.classList.add("themePink");
    app.innerHTML = `
    <div class="container d-flex flex-column justify-content-start align-items-center" style="height:100vh; padding-top: 50px;">
      <h2 class="mb-4" style="font-size: 2.5rem;">My Profile</h2>

      <!-- Carte principale -->
      <div class="card mt-4 semi-transparent-card" style="width: 80%;">
        <div class="card-body">

          <!-- Partie haute du profil : pseudo/avatar-->
            <div class="row">
            <!-- Colonne gauche -->
            <div class="col-md-6 text-center">
            <h4 id="displayName">POIRE</h4>
            <button class="btn my-button btn-sm" id="editNameBtn">
            Edit Name
            </button>
            <img src="rsc/pear.png" alt="Avatar" 
                class="img-fluid rounded-circle mb-3" style="max-width:150px;" />
            <button class="btn my-button btn-sm" id="changeAvatarBtn">
            Change Avatar
            </button>
            <hr/>
            </div>

            <!-- Colonne droite -->
            <div class="col-md-6">
                <h5>Friends</h5>
                <ul id="friendsList">
                <li>Leon (online)</li>
                <li>Lauryn (offline)</li>
                <li>Barbara (online)</li>
                <li>Ismael (offline)</li>
                </ul>
            </div>
            </div>


          <hr/>

          <!-- Stats personnelles -->
          <h5>Stats</h5>
          <p id="statsInfo">Wins: 10 | Losses: 3</p>
          
          <!-- Historique de match -->
          <h5 class="mt-4">Match History</h5>
          <table class="table semi-transparent-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Opponent</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody id="matchHistoryTable">
              <tr>
                <td>2025-03-01</td>
                <td>Player2</td>
                <td>10-7</td>
              </tr>
              <tr>
                <td>2025-03-02</td>
                <td>Player3</td>
                <td>5-10</td>
              </tr>
              <!-- etc. -->
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Bouton “Dashboard” -->
    <div class="position-fixed top-0 start-0 m-4">
      <button class="btn my-button" id="dashboardButton">Dashboard</button>
    </div>

    <!-- Bouton “Login” -->
    <div class="position-fixed top-0 end-0 m-4">
      <button class="btn my-button" id="backToLogin">Back to Login</button>
    </div>
  `;

   // Gérer le bouton Dashboard
   const dashBtn = document.getElementById("dashboardButton");
   dashBtn.addEventListener("click", () => {
     loadDashboard();
   });
 
   // Gérer le bouton Login
   const backBtn = document.getElementById("backToLogin");
   backBtn.addEventListener("click", () => {
     loadLoginPage();
   });
 
   // Bouton pour changer l'avatar
   const avatarBtn = document.getElementById("changeAvatarBtn");
   avatarBtn.addEventListener("click", () => {
     console.log("TODO: open file dialog / handle upload");
   });
 
   // Bouton pour éditer le pseudo
   const editNameBtn = document.getElementById("editNameBtn");
   editNameBtn.addEventListener("click", () => {
     console.log("TODO: show an input for changing the display name");
   });

}