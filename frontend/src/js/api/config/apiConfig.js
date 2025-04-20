import { getAccessToken } from "../../utils/getAccessToken.js"

export const API_ADDR = "127.0.0.1:8080"

export const getApiConfigDefault = (token=null) => {
	const obj = {
		url: "http://"+API_ADDR,
		fetchOptions: {
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		},
	}
	let access_token = token
	if (!access_token)
		access_token = getAccessToken()
	if (access_token)
		obj.fetchOptions.headers["Authorization"] = `Bearer ${access_token}`
	return obj
}

export const getApiConfigPost = () => {
	const apiConfigDefault = getApiConfigDefault()
	return {
		...apiConfigDefault,
		fetchOptions: {
			...apiConfigDefault.fetchOptions,
			method: "POST",
		},
	}
}

export const getApiConfigGet = (token=null) => {
	const apiConfigDefault = getApiConfigDefault(token)
	return {
		...apiConfigDefault,
		fetchOptions: {
			...apiConfigDefault.fetchOptions,
			method: "GET",
		},
	}
}

export const getApiConfigPatch = () => {
	const apiConfigDefault = getApiConfigDefault()
	return {
		...apiConfigDefault,
		fetchOptions: {
			...apiConfigDefault.fetchOptions,
			method: "PATCH",
		},
	}
}

export const getApiConfigPatchAvatar = () => {
	const apiConfigDefault = getApiConfigDefault()
	return {
		...apiConfigDefault,
		fetchOptions: {
			...apiConfigDefault.fetchOptions,
			method: "PATCH",
			headers: {
				...apiConfigDefault.fetchOptions.headers,
				"Content-Type": "multipart/form-data",
			},
		},
	}
}