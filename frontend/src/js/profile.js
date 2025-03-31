// GESTION changement avatar/pseudo, recuperations donnees API stats etc

export async function loadProfilePage() {
    // const response = await fetch('localhost:8080/api/user/profile/', {
    //   headers: {
    //     Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    //   }
    // });
  
    // if (!response.ok) {
    //   console.error("Erreur lors de la récupération du profil");
    //   return;
    // }
  
    // const data = await response.json();
    const data = {
      username: 'Pear',
      avatar: './rsc/pear.png',
      games_played: 5,
      games_won: 3
    };
    document.getElementById('usernameDisplay').textContent = data.username;
    document.getElementById('userAvatar').src = data.avatar || './rsc/pear.png';
  
    // Simulé pour l’instant
    document.getElementById('gamesPlayed').textContent = data.games_played || 0;
    document.getElementById('gamesWon').textContent = data.games_won || 0;
    
    // Settings toggle
    document.getElementById('openSettings').addEventListener('click', () => {
      const modal = document.getElementById('settingsModal');
      modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
    });
    // Handle 2FA settings
    const enable2FA = document.getElementById('enable2FA');
    const email2FASection = document.getElementById('email2FASection');

    // Set initial state based on data.is_2fa_enabled
    enable2FA.checked = data.is_2fa_enabled || false;
    email2FASection.style.display = enable2FA.checked ? 'block' : 'none';

    // Toggle email2FASection visibility when enable2FA is clicked
    enable2FA.addEventListener('change', () => {
      email2FASection.style.display = enable2FA.checked ? 'block' : 'none';
    });

    // Mock data to simulate sending confirmation email for 2FA
    document.getElementById('send2FAEmailBtn').addEventListener('click', () => {
      const emailInput = document.getElementById('email2FAInput').value;

      if (!emailInput) {
      alert('Veuillez entrer une adresse email.');
      return;
      }

      // Simulate opening the confirmation modal
      const verify2FAModal = document.getElementById('verify2FAModal');
      verify2FAModal.style.display = 'block';
    });
    document.getElementById('send2FAEmailBtn').addEventListener('click', async () => {
      const emailInput = document.getElementById('email2FAInput').value;

      if (!emailInput) {
        alert('Veuillez entrer une adresse email.');
        return;
      }

    });



    // Handle 2FA confirmation
    document.getElementById('confirm2FABtn').addEventListener('click', async () => {
      //A RETIRER C'est juste pour visualier l'effet
      alert('2FA activée avec succès.');

      document.getElementById('enable2FA').checked = true; // Update the checkbox
      document.getElementById('settingsModal').style.display = 'none'; // Close settings modal
      document.getElementById('verify2FAModal').style.display = 'none'; // Close verification modal

    });

    // Save settings
    document.getElementById('saveSettings').addEventListener('click', async () => {
  
      // Refresh profile
      document.getElementById('settingsModal').style.display = 'none';
      // loadProfilePage();
    });


    await new Promise(resolve => setTimeout(resolve, 50));
    document.addEventListener("DOMContentLoaded", () => {
        const settingsBtn = document.getElementById("openSettings");
        const settingsModal = document.getElementById("settingsModal");
      
        let isOpen = false;
      
        settingsBtn.addEventListener("click", () => {
          isOpen = !isOpen;
          settingsModal.style.display = isOpen ? "block" : "none";
        });
      // Update displayed username immediately after saving
      document.getElementById('saveSettings').addEventListener('click', () => {
        const newName = document.getElementById('newDisplayName').value;
        if (newName) {
          data.username = newName; // Update the local data object
          document.getElementById('usernameDisplay').textContent = newName; // Update the displayed username
        }
      });
      });
  }
  