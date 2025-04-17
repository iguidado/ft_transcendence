import { soloViewsPreset } from "../../../pong-game/src/config/preset/soloViewsPreset.js";
import { soloPaddlesPreset } from "../../../pong-game/src/config/preset/soloPaddlesPreset.js";
import { versusPaddlesPreset } from "../../../pong-game/src/config/preset/versusPaddlesPreset.js";
import { versusViewsPreset } from "../../../pong-game/src/config/preset/versusViewsPreset.js";
import { horizontalPreset } from "../../../pong-game/src/config/preset/horizontal.js";
import { perspectivePreset } from "../../../pong-game/src/config/preset/perspective.js";
import { horizontalControls } from "../../../pong-game/src/config/paddles/horizontalControls.js";
import { perspectiveControls } from "../../../pong-game/src/config/paddles/perspectiveControls.js";
// import {defaultConfig} from "../../pong-game/src/config/preset/defaultConfig.js"

export const PRESET_TYPE = Object.freeze({
	players: 'players',
	camera: 'camera',
	controls: 'controls',
	isBot: 'isBot'
});

export const settingPresets = [
	{
		name: "Player VS AI",
		gameConfigs: [
			{
				type: PRESET_TYPE.isBot,
				data: soloPaddlesPreset
			},
			{
				type: PRESET_TYPE.camera,
				data: soloViewsPreset
			}
		],
	},
	{
		name: "Player VS Player",
		gameConfigs: [
			{
				type: PRESET_TYPE.isBot,
				data: versusPaddlesPreset
			},
			{
				type: PRESET_TYPE.controls,
				data: {paddles: perspectiveControls}
			},
			{
				type: PRESET_TYPE.camera,
				data: versusViewsPreset
			}
		],
	},
	{
		name: "Perspective",
		gameConfigs: [
			{
				data: perspectivePreset,
				type: PRESET_TYPE.camera
			},
			{
				type: PRESET_TYPE.controls,
				data: {paddles: perspectiveControls}
			},
		],
		
	},
	{
		name: "Horizontal",
		gameConfigs: [
			{
				data: horizontalPreset,
				type: PRESET_TYPE.camera
			},
			{
				type: PRESET_TYPE.controls,
				data: {paddles: horizontalControls}
			},
		],
	}
]