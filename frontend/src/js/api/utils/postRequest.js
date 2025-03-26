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
        // Ajouter les bons en-têtes et transformer le corps en JSON
        const requestOptions = {
            ...config.fetchOptions,
            headers: {
                ...config.fetchOptions.headers,
                'Content-Type': 'application/json'  // Définir le bon type de contenu
            },
            body: JSON.stringify(body)  // Convertir l'objet JavaScript en chaîne JSON
        };

        const response = await fetch(config.url+UrlPath, requestOptions);
    
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Request failed with status ${response.status}`);
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