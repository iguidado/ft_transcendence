export const getGuestList = (errorHandler = console.error) => {
	try {
		const storedProfiles = localStorage.getItem('guestProfiles')
		if (!storedProfiles) {
			return null
		}
		return JSON.parse(storedProfiles) || null
	} catch (error) {
		errorHandler(error)
		return null
	}
}
