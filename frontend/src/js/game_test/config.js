export const configSchema = [
	{
	  section: "Camera Rotation",
	  controls: [
		{
		  id: "rotateX",
		  label: "Rotate X",
		  type: "slider",
		  min: -3.14,
		  max: 3.14,
		  step: 0.01,
		  default: 0,
		  decimals: 2,
		  path: "camera.polar.rotateX"
		},
		{
		  id: "rotateY",
		  label: "Rotate Y",
		  type: "slider",
		  min: -3.14,
		  max: 3.14,
		  step: 0.01,
		  default: 0,
		  decimals: 2,
		  path: "camera.polar.rotateY"
		},
		{
		  id: "rotateZ",
		  label: "Rotate Z",
		  type: "slider",
		  min: -3.14,
		  max: 3.14,
		  step: 0.01,
		  default: 0,
		  decimals: 2,
		  path: "camera.polar.rotateZ"
		}
	  ]
	},
	{
	  section: "Polar Coordinates",
	  controls: [
		{
		  id: "phi",
		  label: "Phi (vertical angle)",
		  type: "slider",
		  min: -1.57,
		  max: 1.57,
		  step: 0.01,
		  default: 0,
		  decimals: 2,
		  path: "camera.polar.phi"
		},
		{
		  id: "theta",
		  label: "Theta (horizontal angle)",
		  type: "slider",
		  min: -3.14,
		  max: 3.14,
		  step: 0.01,
		  default: 0,
		  decimals: 2,
		  path: "camera.polar.theta"
		}
	  ]
	},
	{
	  section: "Camera Distance",
	  controls: [
		{
		  id: "useCalculatedRadius",
		  label: "Use Calculated Radius",
		  type: "checkbox",
		  default: true,
		  path: "camera.polar.useCalculatedRadius",
		  affects: ["manualRadius"]
		},
		{
		  id: "calculatedRadiusMargin",
		  label: "Radius Margin",
		  type: "slider",
		  min: 1,
		  max: 10,
		  step: 0.1,
		  default: 1,
		  decimals: 1,
		  path: "camera.polar.calculatedRadiusMargin"
		},
		{
		  id: "manualRadius",
		  label: "Manual Radius",
		  type: "slider",
		  min: 0,
		  max: 1000,
		  step: 1,
		  default: 92,
		  decimals: 0,
		  path: "camera.polar.radius",
		  dependsOn: {
			control: "useCalculatedRadius",
			value: false
		  }
		}
	  ]
	},
	// Continue with other sections...
	{
	  section: "Game Parameters",
	  controls: [
		{
		  id: "ballSpeed",
		  label: "Ball Speed",
		  type: "slider",
		  min: 0.5,
		  max: 3,
		  step: 0.1,
		  default: 1,
		  decimals: 1,
		  path: "ball.speed"
		},
		{
		  id: "paddleSpeed",
		  label: "Paddle Speed",
		  type: "slider",
		  min: 0.3,
		  max: 2,
		  step: 0.1,
		  default: 0.8,
		  decimals: 1,
		  path: "paddles.speed"
		},
		{
		  id: "ballSize",
		  label: "Ball Radius",
		  type: "slider",
		  min: 0.5,
		  max: 100,
		  step: 0.1,
		  default: 1,
		  decimals: 1,
		  path: "ball.radius"
		}
	  ]
	},
	// Add more sections following the same pattern...
  ];