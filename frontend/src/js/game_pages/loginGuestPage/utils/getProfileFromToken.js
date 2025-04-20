import { profileRequest } from "../../../api/routes/profileRoute.js"
import { formatProfileData } from "../../../utils/profileUtils.js"

export function getProfileFromToken(token) {
	return new Promise(resolve => {
		profileRequest((data) => {
				resolve(formatProfileData(data))
			},
			() => resolve(null),
			token
		)
	})
}