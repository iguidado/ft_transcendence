import { profileRequest } from "../../../api/routes/profileRoute"
import { formatProfileData } from "../../../utils/profileUtils"

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