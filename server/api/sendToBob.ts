export default defineEventHandler(async (event) => {
  console.log('sup')

  const body = await readBody(event);
  console.log('Received body:', body);
  const runtimeConfig = useRuntimeConfig();
  var resp = null
  const headers = {
        'Access-Control-Allow-Origin': 'Same-Origin',
        'crossOriginResourcePolicy': 'same-origin',
        'crossOriginOpenerPolicy': 'same-origin',
        'crossOriginEmbedderPolicy': 'require-corp',
        'contentSecurityPolicy': "default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests",
        'X-XSS-Protection': 1
    }
  setHeaders(event, headers)
  try {
    console.log('Attempting to send to FastAPI at http://busyapi:80/busybob');
    resp = await $fetch(`http://busyapi:80/busybob`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body
    });
    console.log(resp)
    const result = await $fetch('/api/accessUser/surveyCompleted', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        username: body.user
      }
    })
    console.log('MY RESULT FOR THE ADDITION: ', result)
    if(result.status !== 200){
      throw Error('FAILED COMPLETED UPDATE')
    }
  } catch (err) {
    console.error('FAILED TO SEND DATA TO BOB.')
    return {
      message: err,
      code: 401,
      retrievedResponse: resp
    }
  }

  return {
    message: "success",
    code: 200,
    retrievedResponse: resp
  };
});
