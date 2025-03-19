import "./login.js"
import "./pong.js"
import "./build.js"
import "./router.js"
import { load_page } from "./router.js";


document.body.classList.add("themePink");

// === Au f5, on revient sur la meme page parce que flemme de cliquer ===
window.addEventListener("DOMContentLoaded", () => {
    load_page('login');
  });