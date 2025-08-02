import { getCID, setCID } from '~/server/utils/sessionStorage'

export default defineEventHandler(async (event) => {
  const req = await readBody(event)
  if (!req.state) {
    return createError({ statusCode: 400, message: 'Missing state' })
  }
  await setCID(req.state, req.companyID)
  const reg = await getCID(req.state)
  return { reg }
})  