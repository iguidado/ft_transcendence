export const clearGuestStore = (errorHandler=(error) => {}) => {
	try {
		localStorage.removeItem('guestProfiles')
	} catch (error) {
		errorHandler(error);
	}
}
