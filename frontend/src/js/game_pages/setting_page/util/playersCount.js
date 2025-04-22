export const playersCount = (config) => {
	if (!config?.paddles?.controls)
		return 0
	let count = config.paddles.controls.leftBot ? 0 : 1
	count += config.paddles.controls.rightBot ? 0 : 1
	return count
}