import { API_ADDR } from "../api/config/apiConfig.js"

// Gestionnaire centralisé de connexion WebSocket

// Variable globale pour stocker la connexion WebSocket
let userStatusSocket = null;

/**
 * Initialise la connexion WebSocket
 * @returns {WebSocket} L'objet WebSocket créé ou null si pas de token valide
 */
export function initializeWebSocketConnection() {
    const token = localStorage.getItem('access_token');
    if (!token || token === 'null' || token === 'undefined') {
        console.log("Aucun token valide trouvé pour la connexion WebSocket");
        return null;
    }
    
    // Vérification supplémentaire pour s'assurer que le token est valide (format JWT basique)
    if (!token.includes('.')) {
        console.log("Format de token invalide, annulation de la connexion WebSocket");
        return null;
    }
    
    // Fermer l'ancienne connexion si elle existe
    if (userStatusSocket) {
        userStatusSocket.close();
    }
    
    // Utiliser le même hôte que l'application actuelle
    const wssProtocol = 'wss://';
    
    // Déterminer l'hôte et le port corrects pour la connexion WebSocket
    // Option 1: Utiliser directement l'hôte actuel avec un port spécifique
    // const backendHost = window.location.hostname + ':8000';
    
    // Option 2: Valeur codée en dur pour le développement
//	const backendHost = API_ADDR;
    const backendHost = "localhost:__HTTPS_PORT__";
    
    // Construire l'URL correcte avec le token
    const encodedToken = encodeURIComponent(token);
    const wssUrl = `${wssProtocol}${backendHost}/wss/status/?token=${encodedToken}`;
    
    console.log("Connexion au WebSocket avec l'URL:", wssUrl);
    
    userStatusSocket = new WebSocket(wssUrl);
    
    userStatusSocket.onopen = function(event) {
        console.log("WebSocket connection established");
        // Démarrer le ping
        startPing();
        // Dispatcher un événement personnalisé pour notifier les autres parties de l'application
        window.dispatchEvent(new CustomEvent('websocketConnected'));
    };
    
    userStatusSocket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        console.log("WebSocket message received:", data);
        
        // Dispatcher un événement personnalisé avec les données du WebSocket
        if (data.type === "status_update") {
            window.dispatchEvent(new CustomEvent('userStatusUpdate', { 
                detail: {
                    username: data.username,
                    isOnline: data.is_online
                }
            }));
        }
    };
    
    userStatusSocket.onerror = function(error) {
        console.error("WebSocket error:", error);        
        // Ajoutez ces lignes pour mieux déboguer
        if (error.target && error.target.readyState === WebSocket.CLOSED) {
            console.error("WebSocket connection closed unexpectedly. Check server availability and CORS configuration.");
        }
    };
    
    userStatusSocket.onclose = function(event) {
        console.log("WebSocket connection closed", event);
        // Nettoyer l'intervalle de ping
        // Correction: vérifier que pingInterval existe avant d'essayer d'y accéder
        if (userStatusSocket && userStatusSocket.pingInterval) {
            clearInterval(userStatusSocket.pingInterval);
            userStatusSocket.pingInterval = null; // Nettoyer la référence
        }
        
        // Essayer de se reconnecter après un certain délai si la déconnexion n'était pas intentionnelle
        if (event.code !== 1000) { // 1000 est le code de fermeture normale
            console.log("Trying to reconnect WebSocket in 5 seconds...");
            setTimeout(() => {
                initializeWebSocketConnection();
            }, 5000);
        }
    };
    
    // Ajouter cette fonction pour maintenir la connexion active
    function startPing() {
        const pingInterval = setInterval(() => {
            if (userStatusSocket && userStatusSocket.readyState === WebSocket.OPEN) {
                userStatusSocket.send(JSON.stringify({type: "ping"}));
                console.log("Ping envoyé pour maintenir la connexion");
            } else {
                clearInterval(pingInterval);
            }
        }, 30000); // Envoyer un ping toutes les 30 secondes
        
        // Stocker l'intervalle pour pouvoir le nettoyer plus tard
        userStatusSocket.pingInterval = pingInterval;
    }
    
    // Exposer l'objet WebSocket globalement
    window.userStatusSocket = userStatusSocket;
    
    return userStatusSocket;
}

/**
 * Ferme proprement la connexion WebSocket
 */
export function closeWebSocketConnection() {
    if (userStatusSocket) {
        // Nettoyer l'intervalle de ping avant de fermer la connexion
        if (userStatusSocket.pingInterval) {
            clearInterval(userStatusSocket.pingInterval);
            userStatusSocket.pingInterval = null;
        }
        
        userStatusSocket.close(1000); // Fermeture normale
        userStatusSocket = null;
        window.userStatusSocket = null;
    }
}
