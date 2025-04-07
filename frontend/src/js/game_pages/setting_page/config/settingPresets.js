import { soloPreset } from "../../../pong-game/src/config/preset/solo.js";
import { perspectivePreset } from "../../../pong-game/src/config/preset/perspective.js";
import { versus } from "../../../pong-game/src/config/preset/versus.js";
import {horizontalPreset} from "../../../pong-game/src/config/preset/horizontal.js";
// import {defaultConfig} from "../../pong-game/src/config/preset/defaultConfig.js"

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
	},
	{
		name: "Horizontal",
		gameConfig: horizontalPreset,
		type: PRESET_TYPE.camera
	}
]