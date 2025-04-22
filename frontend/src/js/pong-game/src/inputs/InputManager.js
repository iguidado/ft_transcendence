import { gameRegistry } from "../core/GameRegistry.js";
import { InputMap } from "./InputMap.js";

export class InputManager {
    constructor() {
        this.context = gameRegistry.getCurrentContext()
		this.config = this.context.config
		this.inputMap = new InputMap()
        this.keyState = {};
        this.contextpadState = {};
        this.mouseState = {};
        this.setupKeyBinds();
        this.setupGamepadBinds();
        this.setupMouseBinds();
    }

    setupKeyBinds() {
        document.addEventListener('keydown', (event) => {
            this.keyState[event.key] = true;
        });
        document.addEventListener('keyup', (event) => {
            this.keyState[event.key] = false;
        });
    }

    setupGamepadBinds() {
        window.addEventListener("gamepadconnected", (event) => {
        });

        window.addEventListener("gamepaddisconnected", (event) => {
        });
    }

    setupMouseBinds() {
    }

    update() {
		for (const key in this.keyState) {
			if (this.keyState[key] && this.inputMap.map.has(key)) {
				this.inputMap.map.get(key)()
			}
		}
    }

    cleanup() {
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
    }
}