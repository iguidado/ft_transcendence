export default {
	layout: "horizontal", // or "vertical", "grid"
	cameraPresets: [
		{  // Left paddle view
			polar: {
				rotateX: Math.PI/2,
				rotateY: -Math.PI/4, 
				phi: Math.PI/18,
				theta: -Math.PI/4,
				useCalculatedRadius: true,
				calculatedRadiusMargin: 1
			}
		},
		{  // Right paddle view
			polar: {
				rotateX: Math.PI/2,
				rotateY: Math.PI/4,
				phi: Math.PI/18,
				theta: Math.PI/4,
				useCalculatedRadius: true,
				calculatedRadiusMargin: 1
			}
		}
	]
}