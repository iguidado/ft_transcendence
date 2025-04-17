import { load_page } from "../../../router"
import { getAccessToken } from "../../../utils/getAccessToken"
import { getProfileData } from "../../../utils/profileUtils"
import { loadGamePage } from "../../game_page/loadGamePage"
import { loginGuestPage } from "../../loginGuestPage/loginGuestPage"
import { clearGuestStore } from "../../loginGuestPage/utils/clearGuestStore"
import { getGuestList } from "../../loginGuestPage/utils/getGuestList"
import { playersCount } from "./playersCount"

export const setupStartBtn = (ctx) => {
	const startBtn = document.getElementById("start-btn")
	if (!startBtn)
		consople.error("setupStartBtn : can't find #start-btn")
	startBtn.addEventListener("click", () => {
		if (ctx.game)
			ctx.game.cleanup();
		let playerCount = playersCount(ctx.config)
		const localProfile = getProfileData()
		if (!playerCount || (playerCount && localProfile)) {
			loadGamePage({...ctx, players: [localProfile]})
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
			if (!guestList || guestList.length+1 != playerCount) {
				load_page("pong")
				return
			}
			const players = [localProfile, ...guestList]
			loadGamePage({...ctx, players})
		})
	})
}