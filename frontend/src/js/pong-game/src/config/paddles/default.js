export default {
	length: 10,
	depth: 3,
	width: 3,
	maxBounceAngle: Math.PI / 3,
	speed: 0.8,
	controls: {
		speed: 0.7, // Vitesse relative à la balle
		leftBot: true,
		rightBot: true,
		keys: {
			leftUp: 'w',
			leftDown: 's',
			rightUp: 'ArrowUp',
			rightDown: 'ArrowDown'
		},
		bots: {
			reactionDelay: 0,  // Délai de réaction (secondes)
			predictionError: 0, // Erreur de prédiction (0-1)
			randomness: 1,     // Facteur d'aléatoire dans les mouvements (0-1)
			anticipation: 1,    // Capacité à anticiper (0-1)
			aggressive: 0       // Tendance à être agressif (0-1)
		}
	}
}