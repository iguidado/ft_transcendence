import board from "../board/default.js"
import ball from "../ball/default.js"
import paddles from "../paddles/default.js"
import camera from "../camera/default.js"
import defaultViewsConfig from "../views/defaultViewsConfig.js"
import { defaultScoreConfig } from "../score/defaultScoreConfig.js"

export const defaultConfig = {
	board,
	ball,
	paddles,
	camera,
	views: defaultViewsConfig,
	score: defaultScoreConfig
}
