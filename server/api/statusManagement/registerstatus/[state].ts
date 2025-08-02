import { getRegister, setRegister } from '~/server/utils/sessionStorage'

export default defineEventHandler(async (event) => {
  const req = await readBody(event)
  if (!req.state) {
    return createError({ statusCode: 400, message: 'Missing state' })
  }
  await setRegister(req.state, req.isRegistered)
  const reg = await getRegister(req.state)
  return { reg }
})