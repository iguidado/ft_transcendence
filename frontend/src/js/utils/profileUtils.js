import { getApiConfigDefault } from "../api/config/apiConfig.js"
import { profileRequest } from "../api/routes/profileRoute.js"


export const pullProfile = () => {
	return new Promise((resolve, reject) => {
		profileRequest((data) => {
				localStorage.setItem("userProfile", JSON.stringify(data))
				resolve(true)
			},
			(err) => resolve(false)
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
	profile.avatar = getApiConfigDefault().url + profile.avatar_url
	// TODO Calculate real values gamesPlayed and gamesWon
	return profile
}