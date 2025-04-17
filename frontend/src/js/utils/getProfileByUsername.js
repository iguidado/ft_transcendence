import { profileByUsernameRoute } from "../api/routes/profileByUsernameRoute"
import { formatProfileData } from "./profileUtils"

export const getProfileByUsername = async (username) => {
	let res = null
	await profileByUsernameRoute(
		username,
		(data) => {
			res = formatProfileData(data)
		},
		(err) => {
			console.error(err)
			res = null
		}
	)
	return res
}