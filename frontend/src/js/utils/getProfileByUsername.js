import { profileByUsernameRoute } from "../api/routes/profileByUsernameRoute.js"
import { formatProfileData } from "./profileUtils.js"

export const getProfileByUsername = async (username) => {
	let res = null
	await profileByUsernameRoute(
		username,
		(data) => {
			res = formatProfileData(data)
		},
		(err) => {
			res = null
		}
	)
	return res
}