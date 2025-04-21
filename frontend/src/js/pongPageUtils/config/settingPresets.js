import { soloPreset } from "../../pong-game/src/config/preset/solo.js";
import { perspectivePreset } from "../../pong-game/src/config/preset/perspective.js";

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