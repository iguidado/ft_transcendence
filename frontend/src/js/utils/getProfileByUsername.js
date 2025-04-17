import { profileByUsernameRoute } from "../api/routes/profileByUsernameRoute"
import { formatProfileData } from "./profileUtils"

export const getProfileByUsername = async (username) => {
	console.log("----- getProfileByUsername")
	console.log("YAAAA", username)
	let res = null
	await profileByUsernameRoute(
		username,
		(data) => {
			console.log("RESSSSS", formatProfileData(data))
			res = formatProfileData(data)
		},
		(err) => {
			console.error(err)
			res = null
		}
	)
	console.log("YOOOOO", res)
	return res
}