import { updatePreview } from "../updatePreview";

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
				return ctx.game.viewManager.views.length > 1 ? "-" : ctx.game.config.camera.polar.phi
			},
			plusCallback: () => {
				ctx.game.viewManager.views.forEach(({cameraManager}) => cameraManager.phiUp())
				return ctx.game.viewManager.views.length > 1 ? "-" : ctx.game.config.camera.polar.phi
			}
		},
		{
			title: 'Camera Theta',
			defaultValue: ctx.config.camera.polar.theta,
			minusCallback: () => {
				ctx.game.viewManager.views.forEach(({cameraManager}) => cameraManager.thetaDown())
				return ctx.game.config.camera.polar.theta
			},
			plusCallback: () => {
				ctx.game.viewManager.views.forEach(({cameraManager}) => cameraManager.thetaUp())
				return ctx.game.viewManager.views.length > 1 ? "-" : ctx.game.config.camera.polar.theta
			}
		},
		{
			title: 'Camera Rotate X',
			defaultValue: ctx.config.camera.polar.rotateX,
			minusCallback: () => {
				ctx.game.viewManager.views.forEach(({cameraManager}) => cameraManager.rotateDownX())
				return ctx.game.config.camera.polar.rotateX
			},
			plusCallback: () => {
				ctx.game.viewManager.views.forEach(({cameraManager}) => cameraManager.rotateUpX())
				return ctx.game.viewManager.views.length > 1 ? "-" : ctx.game.config.camera.polar.rotateX
			}
		},
		{
			title: 'Camera Rotate Y',
			defaultValue: ctx.config.camera.polar.rotateY,
			minusCallback: () => {
				ctx.game.viewManager.views.forEach(({cameraManager}) => cameraManager.rotateDownY())
				return ctx.game.viewManager.views.length > 1 ? "-" : ctx.game.config.camera.polar.rotateY
			},
			plusCallback: () => {
				ctx.game.viewManager.views.forEach(({cameraManager}) => cameraManager.rotateUpY())
				return ctx.game.viewManager.views.length > 1 ? "-" : ctx.game.config.camera.polar.rotateY
			}
		},
		{
			title: 'Camera Rotate Z',
			defaultValue: ctx.config.camera.polar.rotateZ,
			minusCallback: () => {
				ctx.game.viewManager.views.forEach(({cameraManager}) => cameraManager.rotateDownZ())
				return ctx.game.viewManager.views.length > 1 ? "-" : ctx.game.config.camera.polar.rotateZ
			},
			plusCallback: () => {
				ctx.game.viewManager.views.forEach(({cameraManager}) => cameraManager.rotateUpZ())
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
	]
}