export const addGuestProfileToStore = (profile, errorHandler=console.error) => {
	if (!profile) {
		errorHandler(new Error('Profile and token are required'))
		return
	}
	let profiles = []
	try {
		const storedProfiles = localStorage.getItem('guestProfiles')
		if (storedProfiles) {
			profiles = JSON.parse(storedProfiles)
		}
	} catch (error) {
		if (errorHandler) {
			errorHandler(error)
		}
	}
	const profileWithTimestamp = {
		...profile,
		createdAt: new Date().toISOString(),
		id: profile.id || `guest-${Date.now()}`
	}
	profiles.push(profileWithTimestamp)
	localStorage.setItem('guestProfiles', JSON.stringify(profiles))
}
