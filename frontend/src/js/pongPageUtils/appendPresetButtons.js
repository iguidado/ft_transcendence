import { initConfig, mergeConfig } from '../pong-game/src/config/initConfig';
import { defaultConfig } from '../pong-game/src/config/preset/defaultConfig';
import { settingPresets, PRESET_TYPE } from './config/settingPresets';
import { updatePreview } from './updatePreview';


const active_presets = new Map()
active_presets.set(PRESET_TYPE.default, defaultConfig)
/**
 * Merges all objects stored as values in the active_presets Map
 * @returns {Object} Merged object containing all properties from active presets
*/
export function mergeActivePresets() {
	let mergedConfig = active_presets.get(PRESET_TYPE.default) || {};
	console.log(active_presets)
	active_presets.forEach((presetValue, key) => {
		if (key != PRESET_TYPE.default) {
			console.log(key)
			mergedConfig = mergeConfig(mergedConfig, presetValue)
		}
	});
	return mergedConfig;
}

/**
 * Generates preset buttons based on the settingPresets array
 * @param {Object} ctx - Game context object containing game, container and config
 * @param {string} containerId - ID of the container element where preset buttons will be generated
 */
export function appendPresetButtons(ctx, containerId = 'mods-list-container') {
  const container = document.getElementById(containerId);

  container.innerHTML = '';

  settingPresets.forEach(preset => {
    const presetBtn = document.createElement('button');
    presetBtn.className = 'mod-btn';

    const btnText = document.createElement('p');
    btnText.textContent = preset.name;

    presetBtn.appendChild(btnText);

    presetBtn.addEventListener('click', () => {
		active_presets.set(preset.type, preset.gameConfig)
        ctx.config = mergeActivePresets();
        updatePreview(ctx);
    });

    container.appendChild(presetBtn);
  });
  const presetButtons = container.querySelectorAll('.mod-btn');
  presetButtons.forEach((button, index) => {
    const preset = settingPresets[index];

    button.setAttribute('data-preset-type', preset.type);

    switch (preset.type) {
      case PRESET_TYPE.camera:
        button.classList.add('camera-preset');
        break;
      case PRESET_TYPE.controls:
        button.classList.add('controls-preset');
        break;
      case PRESET_TYPE.default:
      default:
        button.classList.add('default-preset');
        break;
    }
  });
}