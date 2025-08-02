import { getUser, setUser } from '~/server/utils/sessionStorage'

export default defineEventHandler(async (event) => {
  const req = await readBody(event)
  if (!req.state) {
    return createError({ statusCode: 400, message: 'Missing state' })
  }
  await setUser(req.state, req.user)
  const username = await getUser(req.state)
  return { username }
})