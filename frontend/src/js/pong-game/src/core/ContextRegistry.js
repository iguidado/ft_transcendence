class ContextRegistry {
    static instance = null;
    contexts = new Map();
    currentContextId = null;

    static getInstance() {
        if (!ContextRegistry.instance) {
            ContextRegistry.instance = new ContextRegistry();
        }
        return ContextRegistry.instance;
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
            throw new Error('No current context set');
        }
        return this.contexts.get(this.currentContextId);
    }
}

export const contextRegistry = ContextRegistry.getInstance();