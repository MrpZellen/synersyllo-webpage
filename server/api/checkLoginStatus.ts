export default defineEventHandler(async (event) => {
  const tokenCookie = getCookie(event, 'google_tokens')
  if (!tokenCookie) return { loggedIn: false }
  return { loggedIn: true }
})