import { updatePreview } from "../util/updatePreview.js";
import { createKeyCaptureOverlay } from '../util/createKeyCaptureOverlay.js';

const MIN_BOARD_HEIGHT = 30;
const MAX_BOARD_HEIGHT = 70;
const MIN_BOARD_WIDTH = 120;
const MAX_BOARD_WIDTH = 150;
const MIN_SCORE = 1;
const MAX_SCORE = 100;

function captureKey(callback) {
	const overlay = createKeyCaptureOverlay();
	document.body.appendChild(overlay);

	const handleKeyDown = (e) => {
		e.preventDefault();
		document.body.removeChild(overlay);
		document.removeEventListener('keydown', handleKeyDown);
		callback(e.key);
	};

	document.addEventListener('keydown', handleKeyDown);
}

export function CustomBtnsList(ctx) {
	return [
		{
			title: 'Score Max',
			defaultValue: ctx.config.score.max,
			minusCallback: async () => {
				if (ctx.config.score.max > MIN_SCORE) {
					ctx.config.score.max -= 1;
					updatePreview(ctx);
				}
				return ctx.config.score.max;
			},
			plusCallback: async () => {
				if (ctx.config.score.max < MAX_SCORE) {
					ctx.config.score.max += 1;
					updatePreview(ctx);
				}
				return ctx.config.score.max;
			}
		},
		{
			title: 'Left Bot',
			defaultValue: ctx.config.paddles.controls.leftBot,
			minusCallback: async () => {
				ctx.config.paddles.controls.leftBot = !ctx.config.paddles.controls.leftBot
				updatePreview(ctx)
				return ctx.config.paddles.controls.leftBot
			},
			plusCallback: async () => {
				ctx.config.paddles.controls.leftBot = !ctx.config.paddles.controls.leftBot
				updatePreview(ctx)
				return ctx.config.paddles.controls.leftBot
			}
		},
		{
			title: 'Right Bot',
			defaultValue: ctx.config.paddles.controls.rightBot,
			minusCallback: async () => {
				ctx.config.paddles.controls.rightBot = !ctx.config.paddles.controls.rightBot
				updatePreview(ctx)
				return ctx.config.paddles.controls.rightBot
			},
			plusCallback: async () => {
				ctx.config.paddles.controls.rightBot = !ctx.config.paddles.controls.rightBot
				updatePreview(ctx)
				return ctx.config.paddles.controls.rightBot
			}
		},
		{
			title: 'Board Height',
			defaultValue: ctx.config.board.height,
			minusCallback: async () => {
				if (ctx.config.board.height > MIN_BOARD_HEIGHT) {
					ctx.config.board.height -= 1;
					updatePreview(ctx);
				}
				return ctx.config.board.height;
			},
			plusCallback: async () => {
				if (ctx.config.board.height < MAX_BOARD_HEIGHT) {
					ctx.config.board.height += 1;
					updatePreview(ctx);
				}
				return ctx.config.board.height;
			}
		},
		{
			title: 'Board Width',
			defaultValue: ctx.config.board.width,
			minusCallback: async () => {
				if (ctx.config.board.width > MIN_BOARD_WIDTH) {
					ctx.config.board.width -= 1;
					updatePreview(ctx);
				}
				return ctx.config.board.width;
			},
			plusCallback: async () => {
				if (ctx.config.board.width < MAX_BOARD_WIDTH) {
					ctx.config.board.width += 1;
					updatePreview(ctx);
				}
				return ctx.config.board.width;
			}
		},
		{
			title: 'Left Paddle Up',
			defaultValue: ctx.config.paddles.controls.keys.leftUp,
			isKeybind: true,
			minusCallback: null,
			plusCallback: () => {
				return new Promise((resolve) => {
					captureKey((key) => {
						ctx.config.paddles.controls.keys.leftUp = key;
						updatePreview(ctx);
						resolve(key);
					});
				});
			}
		},
		{
			title: 'Left Paddle Down',
			defaultValue: ctx.config.paddles.controls.keys.leftDown,
			isKeybind: true,
			minusCallback: () => {
				return ctx.config.paddles.controls.keys.leftDown;
			},
			plusCallback: () => {
				return new Promise((resolve) => {
					captureKey((key) => {
						ctx.config.paddles.controls.keys.leftDown = key;
						updatePreview(ctx);
						resolve(key);
					});
				});
			}
		},
		{
			title: 'Right Paddle Up',
			defaultValue: ctx.config.paddles.controls.keys.rightUp,
			isKeybind: true,
			minusCallback: () => {
				return ctx.config.paddles.controls.keys.rightUp;
			},
			plusCallback: () => {
				return new Promise((resolve) => {
					captureKey((key) => {
						ctx.config.paddles.controls.keys.rightUp = key;
						updatePreview(ctx);
						resolve(key);
					});
				});
			}
		},
		{
			title: 'Right Paddle Down',
			defaultValue: ctx.config.paddles.controls.keys.rightDown,
			isKeybind: true,
			minusCallback: () => {
				return ctx.config.paddles.controls.keys.rightDown;
			},
			plusCallback: () => {
				return new Promise((resolve) => {
					captureKey((key) => {
						ctx.config.paddles.controls.keys.rightDown = key;
						updatePreview(ctx);
						resolve(key);
					});
				});
			}
		}
	]
}