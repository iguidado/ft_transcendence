import { soloPreset } from "../../pong-game/src/config/preset/solo";
import { perspectivePreset } from "../../pong-game/src/config/preset/perspective";
import { versus } from "../../pong-game/src/config/preset/versus";
// import {defaultConfig} from "../../pong-game/src/config/preset/defaultConfig"

export const PRESET_TYPE = Object.freeze({
	players: 'players',
	camera: 'camera',
	controls: 'controls'
});

export const settingPresets = [
	{
		name: "Player VS AI",
		gameConfig: soloPreset,
		type: PRESET_TYPE.players
	},
	{
		name: "Player VS Player",
		gameConfig: versus,
		type: PRESET_TYPE.players
	},
	{
		name: "Perspective",
		gameConfig: perspectivePreset,
		type: PRESET_TYPE.camera
	}
]