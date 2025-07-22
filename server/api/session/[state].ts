import { getUser } from '~/server/utils/sessionStorage'

export default defineEventHandler(async (event) => {
  const state = event.context.params?.state
  if (!state) {
    return createError({ statusCode: 400, message: 'Missing state' })
  }

  const username = await getUser(state)
  return { username }
})