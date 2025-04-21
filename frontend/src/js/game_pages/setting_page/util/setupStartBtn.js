import { load_page } from "../../../router.js"
import { displayError } from "../../../utils/displayError.js"
import { getAccessToken } from "../../../utils/getAccessToken.js"
import { getProfileData } from "../../../utils/profileUtils.js"
import { loadGamePage } from "../../game_page/loadGamePage.js"
import { loginGuestPage } from "../../loginGuestPage/loginGuestPage.js"
import { clearGuestStore } from "../../loginGuestPage/utils/clearGuestStore.js"
import { getGuestList } from "../../loginGuestPage/utils/getGuestList.js"
import { playersCount } from "./playersCount.js"

export const setupStartBtn = (ctx) => {
	const startBtn = document.getElementById("start-btn")
	if (!startBtn)
		consople.error("setupStartBtn : can't find #start-btn")
	startBtn.addEventListener("click", (e) => {
		e.preventDefault()
		let playerCount = playersCount(ctx.config)
		if (!playerCount) {
			displayError("Choose Mod pls")
			return
		}
		if (ctx.game)
			ctx.game.cleanup();
		const localProfile = getProfileData()
		console.log(playerCount)
		if (!playerCount || (playerCount == 1 && localProfile)) {
			loadGamePage({ ...ctx, players: [localProfile] })
			return
		}
		clearGuestStore()
		loginGuestPage().then((status) => {
			if (!status) {
				load_page("pong")
				return
			}
			if (!localProfile) {
				load_page("pong")
				return
			}
			localProfile.access_token = getAccessToken()
			const guestList = getGuestList()
			if (!guestList || guestList.length + 1 != playerCount) {
				load_page("pong")
				return
			}
			const players = [localProfile, ...guestList]
			clearGuestStore()
			loadGamePage({ ...ctx, players })
		})
	})
}