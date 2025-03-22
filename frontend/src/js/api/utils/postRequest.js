import { apiConfigPost } from "../config/apiConfig";

function responseHandlerDefault(res) {
	console.log(res)
}

function errorHandlerDefault(err) {
	console.error(err)
}

export async function postRequest({
	UrlPath="",
	body,
	responseHandler=responseHandlerDefault,
	errorHandler=errorHandlerDefault,
	config=apiConfigPost
}) {
	try {
		const response = await fetch(config.url+UrlPath, {
		  ...config.fetchOptions,
		  body
		});
	
		if (!response.ok) {
		  const errorData = await response.json();
		  throw new Error(errorData.message || 'Login failed');
		}

		const data = await response.json();
		responseHandler(data)
		
	} catch (error) {
		errorHandler(error)
	}
}

// if (data.token) {
//   localStorage.setItem('authToken', data.token);
// }