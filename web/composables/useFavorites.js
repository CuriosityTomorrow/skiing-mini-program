export function useFavorites() {
  const favoritedIds = useState('favorites', () => new Set())
  const loaded = useState('favorites-loaded', () => false)

  async function load() {
    if (loaded.value) return
    const token = localStorage.getItem('token')
    if (!token) return
    const res = await $fetch('/api/favorites', { headers: { authorization: `Bearer ${token}` } }).catch(() => null)
    if (res?.code === 0) {
      favoritedIds.value = new Set(res.data)
      loaded.value = true
    }
  }

  async function toggle(resortId, event) {
    event?.preventDefault()
    event?.stopPropagation()
    const token = localStorage.getItem('token')
    if (!token) { navigateTo('/login'); return }
    const res = await $fetch('/api/favorites/toggle', {
      method: 'POST',
      headers: { authorization: `Bearer ${token}` },
      body: { resortId },
    }).catch(() => null)
    if (res?.code === 0) {
      const next = new Set(favoritedIds.value)
      res.favorited ? next.add(resortId) : next.delete(resortId)
      favoritedIds.value = next
    }
  }

  return { favoritedIds, load, toggle }
}
