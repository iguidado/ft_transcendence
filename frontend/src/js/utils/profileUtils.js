import { getApiConfigDefault } from "../api/config/apiConfig.js"
import { profileRequest } from "../api/routes/profileRoute.js"


export const pullProfile = () => {
	return new Promise((resolve, reject) => {
		profileRequest((data) => {
				localStorage.setItem("userProfile", JSON.stringify(data))
				resolve(data)
			},
			(err) => {
				localStorage.setItem("userProfile", JSON.stringify(null))
				resolve(null)
			}
		)
	})
}

export const deleteProfileData = () => {
	localStorage.setItem("userProfile", null)
}

export const getProfileData = () => {
	const data = JSON.parse(localStorage.getItem('userProfile'))
	return formatProfileData(data)
}



export function formatProfileData(profile) {
	console.log(profile)
	if (!profile)
		return null
	if (!profile.displayName)
		profile.displayName = profile.username
	if (!profile.avatar.startsWith("http"))
		profile.avatar = getApiConfigDefault().url + profile.avatar
	return profile
}
