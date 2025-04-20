import { getProfileData } from "../../../utils/profileUtils.js"

export const getGuestList = (errorHandler = (error) => {}) => {
	try {
		const storedProfiles = localStorage.getItem('guestProfiles')
		if (!storedProfiles) {
			return null
		}
		const list = JSON.parse(storedProfiles) || null
		if (!list)
			return null
		const localProfile = getProfileData()
		return list.filter(p => !localProfile || localProfile.id != p.id)
	} catch (error) {
		errorHandler(error)
		return null
	}
}
