import { appendCustomSettings } from "./appendCustomSettings.js";
import { CustomBtnsList } from "../config/CustomBtnsList.js";

function setupSwitchMenuButton(ctx) {
	const switchMenuBtn = document.getElementById('switch-menu-btn');
	const settingsTitle = document.querySelector('#settings-title-container p');
	const settingsList = document.getElementById('settings-list-container');
	const modsList = document.getElementById('mods-list-container');
	const btnText = switchMenuBtn.querySelector('p');

	let isCustomMode = false;
	modsList.style.opacity = '1';
	modsList.style.display = 'block';
	settingsList.style.opacity = '0';
	settingsList.style.display = 'none';

	modsList.style.transition = 'opacity 0.3s ease-in-out';
	settingsList.style.transition = 'opacity 0.3s ease-in-out';

	switchMenuBtn.addEventListener('click', () => {
		isCustomMode = !isCustomMode;

		if (!isCustomMode) {
			btnText.textContent = "=> " + 'Custom';
			settingsTitle.textContent = 'Mods';

			settingsList.style.opacity = '0';
			setTimeout(() => {
				settingsList.style.display = 'none';
				modsList.style.display = 'block';

				setTimeout(() => {
					modsList.style.opacity = '1';
				}, 50);
			}, 300);
		} else {
			appendCustomSettings(CustomBtnsList(ctx))
			btnText.textContent = "=> " + 'Mods';
			settingsTitle.textContent = 'Custom';

			modsList.style.opacity = '0';
			setTimeout(() => {
				modsList.style.display = 'none';
				settingsList.style.display = 'block';

				setTimeout(() => {
					settingsList.style.opacity = '1';
				}, 50);
			}, 300);
		}
	});
}


export { setupSwitchMenuButton };