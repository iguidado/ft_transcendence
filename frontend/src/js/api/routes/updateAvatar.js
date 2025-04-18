import { patchAvatar } from "../utils/patchAvatar.js"

export function updateAvatarResponseHandler(response) {
    return response.json().then(data => {
        console.log("Avatar mis à jour avec succès:", data);
        return data;
    });
}

function updateAvatarErrorHandler(error) {
    console.error("Erreur lors de la mise à jour de l'avatar:", error);
    return Promise.reject(error);
}

export function updateAvatarRequest(formData, responseHandler=updateAvatarResponseHandler, errorHandler=updateAvatarErrorHandler) {
    if (!(formData instanceof FormData)) {
        const error = new Error("Les données doivent être au format FormData");
        errorHandler(error);
        return Promise.reject(error);
    }
    
    // Récupérer le fichier depuis formData pour l'adapter au format attendu par patchAvatar
    const avatarFile = formData.get('avatar');
    if (!avatarFile) {
        const error = new Error("Aucun fichier d'avatar trouvé dans le FormData");
        errorHandler(error);
        return Promise.reject(error);
    }
    
    return patchAvatar({
        UrlPath: "/api/user/profile/update_avatar/",
        body: {
            file: avatarFile  // Utiliser le format attendu par patchAvatar
        },
        responseHandler,
        errorHandler
    });
}