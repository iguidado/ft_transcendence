export const getGuestProfileFromStore = (profileId, errorHandler = console.error) => {
	if (!profileId) {
		errorHandler('Profile ID is required')
		return null
	}
	try {
		const storedProfiles = localStorage.getItem('guestProfiles')
		if (!storedProfiles) {
			return null
		}
		const profiles = JSON.parse(storedProfiles)
		const profile = profiles.find(p => p.id === profileId)
		return profile || null
	} catch (error) {
		errorHandler(error)
		return null
	}
}
