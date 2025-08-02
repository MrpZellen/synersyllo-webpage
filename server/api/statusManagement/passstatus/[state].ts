import { getPass, setPass } from '~/server/utils/sessionStorage'

export default defineEventHandler(async (event) => {
  const req = await readBody(event)
  if (!req.state) {
    return createError({ statusCode: 400, message: 'Missing state' })
  }
  await setPass(req.state, req.pass)
  const reg = await getPass(req.state)
  return { reg }
})  