import { getApiConfigDefault } from "../api/config/apiConfig";
import { profileRequest } from "../api/routes/profileRoute";


export const pullProfile = () => {
	return new Promise((resolve, reject) => {
		profileRequest((data) => {
				localStorage.setItem("userProfile", JSON.stringify(data))
				resolve(true)
			},
			(err) => resolve(false)
		)
	})
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
	data.avatar = getApiConfigDefault().url + data.avatar_url
	// TODO Calculate real values gamesPlayed and gamesWon
	data.gamesPlayed = 0
	data.gamesWon = 0
	return data
}