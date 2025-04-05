import { getApiConfigPost } from "../config/apiConfig";

function responseHandlerDefault(res) {
	console.log(res);
}

function errorHandlerDefault(err) {
	console.error(err);
}

// Error renvoie l'information fournie par le serveur ( mais dans un format moche si tu arrives a changer c'est bien en parsant le json)
export async function postRequest({
	UrlPath = "",
	body,
	responseHandler = responseHandlerDefault,
	errorHandler = errorHandlerDefault,
	config,
}) {
	if (!config) config = getApiConfigPost();
	try {
		const requestOptions = {
			...config.fetchOptions,
			headers: {
				...config.fetchOptions.headers,
			},
			body: JSON.stringify(body),
		};
		const response = await fetch(config.url + UrlPath, requestOptions)
		if (!response.ok) {

			throw new Error(
				await response.text()
			);
		}
		const data = await response.json();
		responseHandler(data);
	} catch (error) {
		errorHandler(error);
	}
}
