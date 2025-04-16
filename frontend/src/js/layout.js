import { load_page } from "./router.js";
import { disconnect } from "./utils/disconnect.js";


function toggleLayerPair(event) {
	const btn = event.currentTarget;
	const onId = btn.getAttribute("data-on");
	const offId = btn.getAttribute("data-off");
	const onEl = document.getElementById(onId);
	const offEl = document.getElementById(offId);

	if (offEl.style.display !== "none") {
		offEl.style.display = "none";
		onEl.style.display = "block";
	} else {
		offEl.style.display = "block";
		onEl.style.display = "none";
	}
}

export function initBuildButtons() {
	const hotspots = document.querySelectorAll("[data-off][data-on]");
	hotspots.forEach((btn) => {
		btn.addEventListener("mouseover", toggleLayerPair);
		btn.addEventListener("mouseout", toggleLayerPair);
		const loaddest = btn.getAttribute("data-load");
		if (loaddest) {
			btn.addEventListener("click", () => {
				if (loaddest === "login") {
					disconnect();
					return;
				}
				load_page(loaddest);
			});
		}
	});
}



export function displayResults(message) {
    const messageElement = document.getElementById("winMsg");
    messageElement.textContent = message;
	console.log("WinMsg = " + message);
  
    const modalElement = document.getElementById("resultModal");
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }
