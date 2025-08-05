import { getPage, setPage } from '~/server/utils/sessionStorage'

export default defineEventHandler(async (event) => {
  const req = await readBody(event)
  if (!req.state) {
    return createError({ statusCode: 400, message: 'Missing state' })
  }
  await setPage(req.state, req.page)
  const reg = await getPage(req.state)
  return { reg }
})  