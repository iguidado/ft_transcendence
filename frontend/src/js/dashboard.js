import { leaderboardRequest } from "./api/routes/leaderboard.js";
import { load_page } from "./router.js";
import { chooseName } from "./utils/profileUtils.js";
// import { displayError } from "./utils/displayError.js";


export function loadDashboardPage() {
	leaderboardRequest(displayInformation, logErr)
}

function logErr(err) {
	console.warn(err)
}

function displayInformation(data) {
	const leaderboard_table = document.getElementById("leaderboard-table-body")
	// Clear existing table content
	leaderboard_table.innerHTML = '';

	// Check if data exists and has items
	if (!data || data.length === 0) {
		const row = document.createElement('tr');
		const cell = document.createElement('td');
		cell.textContent = 'No leaderboard data available';
		cell.colSpan = 5; // Updated column span to match new structure
		row.appendChild(cell);
		leaderboard_table.appendChild(row);
		return;
	}

	// Add each player to the table
	data.forEach((player, index) => {
		const row = document.createElement('tr');
		
		// Add rank cell (position)
		const rankCell = document.createElement('td');
		rankCell.textContent = index + 1;
		row.appendChild(rankCell);
		
		// Add username cell with clickable link
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
		
		// Add win ratio cell
		const winRatioCell = document.createElement('td');
		winRatioCell.textContent = player.win_ratio?.toFixed(2) || '0.00';
		row.appendChild(winRatioCell);
		
		// Add wins cell
		const winsCell = document.createElement('td');
		winsCell.textContent = player.wins || 0;
		row.appendChild(winsCell);
		
		// Add losses cell
		const lossesCell = document.createElement('td');
		lossesCell.textContent = player.looses || 0; // Using "looses" as specified in the model
		row.appendChild(lossesCell);
		
		// Append the row to the table
		leaderboard_table.appendChild(row);
	});
}