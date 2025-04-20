
export const updateGuest = (id, newTDN, errorHandler = (error) => {}) => {
    try {
        const storedProfiles = localStorage.getItem('guestProfiles')
        if (!storedProfiles) {
            return null
        }
        const list = JSON.parse(storedProfiles) || null
        if (!list)
            return null
        const profile = list.find(p => p.id == id)
        if (!profile)
            return null
        profile.displayName = newTDN
        localStorage.setItem('guestProfiles', JSON.stringify(list))
        return list
    } catch (error) {
        errorHandler(error)
        return null
    }
}
