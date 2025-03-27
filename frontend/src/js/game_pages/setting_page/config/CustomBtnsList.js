import { updatePreview } from "../updatePreview";
import { createKeyCaptureOverlay } from '../createKeyCaptureOverlay';

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
			title: 'Board Height',
			defaultValue: ctx.config.board.height,
			minusCallback: () => {
				ctx.config.board.height -= 1
				updatePreview(ctx)
				return ctx.config.board.height
			},
			plusCallback: () => {
				ctx.config.board.height += 1
				updatePreview(ctx)
				return ctx.config.board.height
			}
		},
		{
			title: 'Board Width',
			defaultValue: ctx.config.board.width,
			minusCallback: () => {
				ctx.config.board.width -= 1
				updatePreview(ctx)
				return ctx.config.board.width
			},
			plusCallback: () => {
				ctx.config.board.width += 1
				updatePreview(ctx)
				return ctx.config.board.width
			}
		},
		{
			title: 'Camera Phi',
			defaultValue: ctx.config.camera.polar.phi,
			minusCallback: () => {
				ctx.game.viewManager.views.forEach(({cameraManager}) => cameraManager.phiDown())
				ctx.config.camera.polar.phi = ctx.game.config.camera.polar.phi
				return ctx.game.viewManager.views.length > 1 ? "-" : ctx.game.config.camera.polar.phi
			},
			plusCallback: () => {
				ctx.config.camera.polar.phi = ctx.game.config.camera.polar.phi
				ctx.game.viewManager.views.forEach(({cameraManager}) => cameraManager.phiUp())
				return ctx.game.viewManager.views.length > 1 ? "-" : ctx.game.config.camera.polar.phi
			}
		},
		{
			title: 'Camera Theta',
			defaultValue: ctx.config.camera.polar.theta,
			minusCallback: () => {
				ctx.config.camera.polar.theta = ctx.game.config.camera.polar.theta
				ctx.game.viewManager.views.forEach(({cameraManager}) => cameraManager.thetaDown())
				return ctx.game.config.camera.polar.theta
			},
			plusCallback: () => {
				ctx.config.camera.polar.theta = ctx.game.config.camera.polar.theta
				ctx.game.viewManager.views.forEach(({cameraManager}) => cameraManager.thetaUp())
				return ctx.game.viewManager.views.length > 1 ? "-" : ctx.game.config.camera.polar.theta
			}
		},
		{
			title: 'Camera Rotate X',
			defaultValue: ctx.config.camera.polar.rotateX,
			minusCallback: () => {
				ctx.game.viewManager.views.forEach(({cameraManager}) => cameraManager.rotateDownX())
				ctx.config.camera.polar.rotateX = ctx.game.config.camera.polar.rotateX
				return ctx.game.config.camera.polar.rotateX
			},
			plusCallback: () => {
				ctx.game.viewManager.views.forEach(({cameraManager}) => cameraManager.rotateUpX())
				ctx.config.camera.polar.rotateX = ctx.game.config.camera.polar.rotateX
				return ctx.game.viewManager.views.length > 1 ? "-" : ctx.game.config.camera.polar.rotateX
			}
		},
		{
			title: 'Camera Rotate Y',
			defaultValue: ctx.config.camera.polar.rotateY,
			minusCallback: () => {
				ctx.game.viewManager.views.forEach(({cameraManager}) => cameraManager.rotateDownY())
				ctx.config.camera.polar.rotateY = ctx.game.config.camera.polar.rotateY
				return ctx.game.config.camera.polar.rotateY
			},
			plusCallback: () => {
				ctx.game.viewManager.views.forEach(({cameraManager}) => cameraManager.rotateUpY())
				ctx.config.camera.polar.rotateY = ctx.game.config.camera.polar.rotateY
				return ctx.game.viewManager.views.length > 1 ? "-" : ctx.game.config.camera.polar.rotateY
			}
		},
		{
			title: 'Camera Rotate Z',
			defaultValue: ctx.config.camera.polar.rotateZ,
			minusCallback: () => {
				ctx.game.viewManager.views.forEach(({cameraManager}) => cameraManager.rotateDownZ())
				ctx.config.camera.polar.rotateZ = ctx.game.config.camera.polar.rotateZ
				return ctx.game.config.camera.polar.rotateZ
			},
			plusCallback: () => {
				ctx.game.viewManager.views.forEach(({cameraManager}) => cameraManager.rotateUpZ())
				ctx.config.camera.polar.rotateZ = ctx.game.config.camera.polar.rotateZ
				return ctx.game.viewManager.views.length > 1 ? "-" : ctx.game.config.camera.polar.rotateZ
			}
		},
		{
			title: 'Camera margin',
			defaultValue: ctx.config.camera.boundingBoxMargin,
			minusCallback: () => {
				ctx.config.camera.boundingBoxMargin -= 1
				updatePreview(ctx)
				return ctx.config.camera.boundingBoxMargin
			},
			plusCallback: () => {
				ctx.config.camera.boundingBoxMargin += 1
				updatePreview(ctx)
				return ctx.config.camera.boundingBoxMargin
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