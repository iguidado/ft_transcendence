class GameRegistry {
    static instance = null;
    contexts = new Map();
    currentContextId = null;

    static getInstance() {
        if (!GameRegistry.instance) {
            GameRegistry.instance = new GameRegistry();
        }
        return GameRegistry.instance;
    }

    registerContext(gameId, context) {
        this.contexts.set(gameId, context);
    }

    setCurrentContext(gameId) {
        if (!this.contexts.has(gameId)) {
            throw new Error(`No context found for game ${gameId}`);
        }
        this.currentContextId = gameId;
    }

    getCurrentContext() {
        if (!this.currentContextId) {
            return null
        }
        return this.contexts.get(this.currentContextId);
    }
}

export const gameRegistry = GameRegistry.getInstance();