import { getApiConfigDefault } from "../api/config/apiConfig";
import { profileRequest } from "../api/routes/profileRequest";


export const pullProfile = () => {
	profileRequest((data) => {
		localStorage.setItem("userProfile", JSON.stringify(data))
	});
};

export const deleteProfileData = () => {
	localStorage.setItem("userProfile", null)
}

export const getProfileData = () => {
	const data = JSON.parse(localStorage.getItem('userProfile'))
	if (!data)
		return null
	if (!data.displayName)
		data.displayName = data.username
	// TODO Image qui fonctionne
	data.avatar = getApiConfigDefault().url + data.avatar
	console.log("Profile image URL", data.avatar)
	// TODO Calculate real values gamesPlayed and gamesWon
	data.gamesPlayed = 0
	data.gamesWon = 0
	return data
}