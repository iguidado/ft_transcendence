import { soloPreset } from "../../pong-game/src/config/preset/solo";
import { perspectivePreset } from "../../pong-game/src/config/preset/perspective";
// import {defaultConfig} from "../../pong-game/src/config/preset/defaultConfig"

export const PRESET_TYPE = Object.freeze({
	default: 'default',
	camera: 'camera',
	controls: 'controls'
});

export const settingPresets = [
	{
		name: "Player VS AI",
		gameConfig: soloPreset,
		type: PRESET_TYPE.default
	},
	{
		name: "Player VS Player",
		gameConfig: perspectivePreset,
		type: PRESET_TYPE.default
	},
	{
		name: "Perspective",
		gameConfig: perspectivePreset,
		type: PRESET_TYPE.camera
	}
]