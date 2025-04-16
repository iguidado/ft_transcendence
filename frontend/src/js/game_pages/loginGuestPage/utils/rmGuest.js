import { getGuestList } from "./getGuestList";

export function rmGuest(id) {
	let list = getGuestList()
	list = list.filter(profile => profile.id != id)
	localStorage.setItem('guestProfiles', JSON.stringify(list))
}