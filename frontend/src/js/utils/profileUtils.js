import { getApiConfigDefault } from "../api/config/apiConfig.js"
import { profileRequest } from "../api/routes/profileRoute.js"


export const pullProfile = async () => {
	let profileData = null
	await profileRequest(
		(data) => {
			localStorage.setItem("userProfile", JSON.stringify(data))
			profileData = data
		},
		(err) => {
			localStorage.setItem("userProfile", JSON.stringify(null))
		}
	)
	return profileData
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
//	if (!profile.avatar.startsWith("http"))
//		profile.avatar = getApiConfigDefault().url + profile.avatar
	return profile
}


export function chooseName(profile) {
	if (profile?.displayName && profile?.displayName.length > 0)
		return profile?.displayName
	if (profile?.username && profile?.username.length > 0)
		return profile?.username
	console.log("ICI", profile)
	return "Unknown"
}
