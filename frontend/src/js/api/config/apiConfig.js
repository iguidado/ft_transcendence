import { getAccessToken } from "../../utils/getAccessToken";

export const getApiConfigDefault = () => {
	const obj = {
		url: "http://127.0.0.1:8000",
		fetchOptions: {
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		},
	};
	const access_token = getAccessToken();
	if (access_token)
		obj.fetchOptions.headers["Authorization"] = `Bearer ${access_token}`;
	return obj;
};

export const getApiConfigPost = () => {
	const apiConfigDefault = getApiConfigDefault();
	return {
		...apiConfigDefault,
		fetchOptions: {
			...apiConfigDefault.fetchOptions,
			method: "POST",
		},
	};
};

export const getApiConfigGet = () => {
	const apiConfigDefault = getApiConfigDefault();
	return {
		...apiConfigDefault,
		fetchOptions: {
			...apiConfigDefault.fetchOptions,
			method: "GET",
		},
	};
};
