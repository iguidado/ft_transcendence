// Function to handle the switch menu button functionality
function setupSwitchMenuButton() {
    const switchMenuBtn = document.getElementById('switch-menu-btn');
    const settingsTitle = document.querySelector('#settings-title-container h2');
    const settingsList = document.getElementById('settings-list-container');
    const modsList = document.getElementById('mods-list-container');
    const btnText = switchMenuBtn.querySelector('p');
    
    // Set initial state
    let isCustomMode = false;
    modsList.style.opacity = '1';
    modsList.style.display = 'block';
    settingsList.style.opacity = '0';
    settingsList.style.display = 'none';settingsList
    
    // Apply transitions for smooth fading
    modsList.style.transition = 'opacity 0.3s ease-in-out';
    settingsList.style.transition = 'opacity 0.3s ease-in-out';
    
    switchMenuBtn.addEventListener('click', () => {
        isCustomMode = !isCustomMode;
        
        if (!isCustomMode) {
            // Switch to Custom mode
            btnText.textContent = "=> "+'Custom';
            settingsTitle.textContent = 'Mods';
            
            // Fade out settings list
            settingsList.style.opacity = '0';
            setTimeout(() => {
                settingsList.style.display = 'none';
                modsList.style.display = 'block';
                
                // Small delay before fade in for smoother transition
                setTimeout(() => {
                    modsList.style.opacity = '1';
                }, 50);
            }, 300);
        } else {
            // Switch to Mods mode
            btnText.textContent = "=> "+'Mods';
            settingsTitle.textContent = 'Custom';
            
            // Fade out mods list
            modsList.style.opacity = '0';
            setTimeout(() => {
                modsList.style.display = 'none';
                settingsList.style.display = 'block';
                
                // Small delay before fade in for smoother transition
                setTimeout(() => {
                    settingsList.style.opacity = '1';
                }, 50);
            }, 300);
        }
    });
}

// Initialize the button functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setupSwitchMenuButton();
});

// Export function if using modules
export { setupSwitchMenuButton };