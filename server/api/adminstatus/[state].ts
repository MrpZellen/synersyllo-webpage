import { getAdmin, setAdmin } from '~/server/utils/sessionStorage'

export default defineEventHandler(async (event) => {
  const req = await readBody(event)
  if (!req.state) {
    return createError({ statusCode: 400, message: 'Missing state' })
  }
  await setAdmin(req.state, req.admin)
  const reg = await getAdmin(req.state)
  return { reg }
})  