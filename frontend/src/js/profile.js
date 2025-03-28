// GESTION changement avatar/pseudo, recuperations donnees API stats etc

export async function loadProfilePage() {
    const response = await fetch('/api/user/profile/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
  
    if (!response.ok) {
      console.error("Erreur lors de la récupération du profil");
      return;
    }
  
    const data = await response.json();
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
  
    // Save settings
    document.getElementById('saveSettings').addEventListener('click', async () => {
      const newName = document.getElementById('newDisplayName').value;
      const newAvatar = document.getElementById('newAvatarURL').value;
  
      if (newName) {
        await fetch('/api/user/profile/update_displayname/', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: JSON.stringify({ display_name: newName })
        });
      }
  
      if (newAvatar) {
        await fetch('/api/user/profile/update_avatar/', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          },
          body: JSON.stringify({ avatar: newAvatar })
        });
      }
  
      // Refresh profile
      loadProfilePage();
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
      
        // Bonus : Fermer quand on clique en dehors
        document.addEventListener("click", (e) => {
          if (
            isOpen &&
            !settingsModal.contains(e.target) &&
            e.target !== settingsBtn
          ) {
            settingsModal.style.display = "none";
            isOpen = false;
          }
        });
      });
  }
  