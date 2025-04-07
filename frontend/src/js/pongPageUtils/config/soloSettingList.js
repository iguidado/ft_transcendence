import { updatePreview } from "../updatePreview.js";

export function soloSettingList(ctx) {
	return [
		{
			title: 'Board Height',
			value: ctx.config?.board.height,
			min: 20,
			max: 200,
			minusCallback: () => {
				ctx.config.board.height -= 1
				updatePreview(ctx)
			},
			plusCallback: () => {
				ctx.config.board.height += 1
				updatePreview(ctx)
			}
		},
		{
			title: 'Board Width',
			value: ctx.config?.board.width,
			min: 20,
			max: 1000,
			minusCallback: () => {
				ctx.config.board.width -= 1
				updatePreview(ctx)
			},
			plusCallback: () => {
				ctx.config.board.width += 1
				updatePreview(ctx)
			}
		},
		{
			title: 'Camera Phi',
			value: ctx.config?.camera.polar.phi || 0,
			min: 0,
			max: 180,
			minusCallback: () => {
				ctx.game.viewManager.views.forEach(({cameraManager}) => cameraManager.phiDown())
			},
			plusCallback: () => {
				ctx.game.viewManager.views.forEach(({cameraManager}) => cameraManager.phiUp())
			}
		},
		{
			title: 'Camera Theta',
			value: ctx.config?.camera.polar.theta,
			min: 0,
			max: 360,
			minusCallback: () => {
				ctx.game.viewManager.views.forEach(({cameraManager}) => cameraManager.thetaDown())
			},
			plusCallback: () => {
				ctx.game.viewManager.views.forEach(({cameraManager}) => cameraManager.thetaUp())
			}
		},
		{
			title: 'Camera Rotate X',
			value: ctx.config?.camera.polar.rotateX,
			min: 0,
			max: 360,
			minusCallback: () => {
				ctx.game.viewManager.views.forEach(({cameraManager}) => cameraManager.rotateDownX())
			},
			plusCallback: () => {
				ctx.game.viewManager.views.forEach(({cameraManager}) => cameraManager.rotateUpX())
			}
		},
		{
			title: 'Camera Rotate Y',
			value: ctx.config?.camera.polar.rotateY,
			min: 0,
			max: 360,
			minusCallback: () => {
				ctx.game.viewManager.views.forEach(({cameraManager}) => cameraManager.rotateDownY())
			},
			plusCallback: () => {
				ctx.game.viewManager.views.forEach(({cameraManager}) => cameraManager.rotateUpY())
			}
		},
		{
			title: 'Camera Rotate Z',
			value: ctx.config?.camera.polar.rotateZ,
			min: 0,
			max: 360,
			minusCallback: () => {
				ctx.game.viewManager.views.forEach(({cameraManager}) => cameraManager.rotateDownZ())
			},
			plusCallback: () => {
				ctx.game.viewManager.views.forEach(({cameraManager}) => cameraManager.rotateUpZ())
			}
		}
	]
}