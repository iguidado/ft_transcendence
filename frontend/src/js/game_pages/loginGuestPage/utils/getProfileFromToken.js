import { profileRequest } from "../../../api/routes/profileRoute"

export function getProfileFromToken(token) {
	return new Promise(resolve => {
		profileRequest((data) => {
				resolve(data)
			},
			() => resolve(null),
			token
		)
	})
}