export function createKeyCaptureOverlay() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;

    const message = document.createElement('div');
    message.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 5px;
        text-align: center;
    `;
    message.textContent = 'Press any key...';
    overlay.appendChild(message);

    return overlay;
}