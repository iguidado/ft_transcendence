export const getAccessToken = () => {
	const accessToken = localStorage.getItem('access_token')
	if (
		accessToken != undefined &&
		accessToken != null &&
		accessToken != "undefined" &&
		accessToken != "null"
	)
		return accessToken;
	return null
}
