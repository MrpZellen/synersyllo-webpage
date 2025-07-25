
export default defineEventHandler(async (event) => {
  try {
    deleteCookie(event, 'google_tokens')
    deleteCookie(event, 'adminacc')
    return {
      info: 'cookie removed!',
      status: 200,
      code: 'success'
    }
  } catch (error) {
    console.log('WHATWENTWRONG', error)
      return {
        info: null,
        status: 400,
        code: 'failed'
      }
  }
})
