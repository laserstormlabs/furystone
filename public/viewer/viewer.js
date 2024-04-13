window.addEventListener("DOMContentLoaded", () => {
    let message = { type: 'load', loaded: true };
    window.parent.postMessage(JSON.stringify(message), location.origin);
});

window.addEventListener("focus", () => {
    console.log("FOCUSED!");
    let message = { type: 'focus', focused: true };
    window.parent.postMessage(JSON.stringify(message), location.origin);
});

window.addEventListener("blur", () => {
    let message = { type: 'focus', focused: false };
    window.parent.postMessage(JSON.stringify(message), location.origin);
});