export const clearGuestStore = (errorHandler=console.error) => {
	try {
		localStorage.removeItem('guestProfiles')
	} catch (error) {
		errorHandler(error);
	}
}
