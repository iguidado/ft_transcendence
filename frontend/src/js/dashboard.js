import { leaderboardRequest } from "./api/routes/leaderboard.js";
import { load_page } from "./router.js";
import { chooseName } from "./utils/profileUtils.js";


export function loadDashboardPage() {
	leaderboardRequest(displayInformation, logErr)
}

function logErr(err) {
	console.warn(err)
}

function displayInformation(data) {
	const leaderboard_table = document.getElementById("leaderboard-table-body")
	leaderboard_table.innerHTML = '';

	if (!data || data.length === 0) {
		const row = document.createElement('tr');
		const cell = document.createElement('td');
		cell.textContent = 'No leaderboard data available';
		cell.colSpan = 5;
		row.appendChild(cell);
		leaderboard_table.appendChild(row);
		return;
	}

	data.forEach((player, index) => {
		const row = document.createElement('tr');
		
		const rankCell = document.createElement('td');
		rankCell.textContent = index + 1;
		row.appendChild(rankCell);
		
		const usernameCell = document.createElement('td');
		const usernameLink = document.createElement('span');
		usernameLink.textContent = chooseName(player).charAt(0).toUpperCase() + chooseName(player).slice(1);
		usernameLink.className = 'player-link';
		usernameLink.style.cursor = 'pointer';
		usernameLink.onclick = (e) => {
			e.preventDefault();
			load_page("profile/" + player.username);
		};
		usernameCell.appendChild(usernameLink);
		row.appendChild(usernameCell);
		
		const winRatioCell = document.createElement('td');
		winRatioCell.textContent = player.win_ratio?.toFixed(2) || '0.00';
		row.appendChild(winRatioCell);
		
		const winsCell = document.createElement('td');
		winsCell.textContent = player.wins || 0;
		row.appendChild(winsCell);
		
		const lossesCell = document.createElement('td');
		lossesCell.textContent = player.looses || 0;
		row.appendChild(lossesCell);
		
		leaderboard_table.appendChild(row);
	});
}