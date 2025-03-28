import board from "../board/default"
import ball from "../ball/default"
import paddles from "../paddles/default"
import camera from "../camera/default"
import defaultViewsConfig from "../views/defaultViewsConfig"
import { defaultScoreConfig } from "../score/defaultScoreConfig"

export const defaultConfig = {
	board,
	ball,
	paddles,
	camera,
	views: defaultViewsConfig,
	score: defaultScoreConfig
}
