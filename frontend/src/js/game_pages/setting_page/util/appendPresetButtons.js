import { initConfig, mergeConfig } from '../../../pong-game/src/config/initConfig.js'
import { defaultConfig } from '../../../pong-game/src/config/preset/defaultConfig.js'
import { settingPresets, PRESET_TYPE } from '../config/settingPresets.js'
import { updatePreview } from './updatePreview.js'


const active_presets = new Map()
active_presets.set(PRESET_TYPE.players, defaultConfig)
/**
 * Merges all objects stored as values in the active_presets Map
 * @returns {Object} Merged object containing all properties from active presets
*/
export function mergeActivePresets() {
	let mergedConfig = {}
	active_presets.forEach(presetValue => {
		mergedConfig = mergeConfig(mergedConfig, presetValue)
	})
	return mergedConfig
}

/**
 * Generates preset buttons based on the settingPresets array
 * @param {Object} ctx - Game context object containing game, container and config
 * @param {string} containerId - ID of the container element where preset buttons will be generated
 */
export function appendPresetButtons(ctx, containerId = 'mods-list-container') {
	const container = document.getElementById(containerId)

	container.innerHTML = ''

	const sections = []
	settingPresets.forEach(preset => {
		if (sections.indexOf(preset.gameConfigs[0].type) == -1) {
			sections.push(preset.gameConfigs[0].type)
			const title = document.createElement('h3')
			title.textContent = preset.gameConfigs[0].type.charAt(0).toUpperCase() + preset.gameConfigs[0].type.slice(1)
			container.appendChild(title)
		}
		const presetBtn = document.createElement('button')
		presetBtn.className = 'mod-btn'

		const btnText = document.createElement('p')
		btnText.textContent = preset.name

		presetBtn.setAttribute('data-preset-type', preset.gameConfigs[0].type)

		switch (preset.gameConfigs[0].type) {
			case PRESET_TYPE.camera:
				presetBtn.classList.add('camera-preset')
				break
			case PRESET_TYPE.controls:
				presetBtn.classList.add('controls-preset')
				break
			case PRESET_TYPE.players:
			default:
				presetBtn.classList.add('default-preset')
				break
		}
		presetBtn.appendChild(btnText)
		presetBtn.addEventListener('click', (e) => {
			e.preventDefault()
			preset.gameConfigs.forEach((conf) => {
				active_presets.set(conf.type, conf.data)
			})
			ctx.config = initConfig(mergeActivePresets())
			updatePreview(ctx)
		})
		container.appendChild(presetBtn)
	})
}