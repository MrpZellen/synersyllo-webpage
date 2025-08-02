

export default defineEventHandler(async (event) => {
  const tokenCookie = getCookie(event, 'google_tokens')
  const adminCookie = getCookie(event, 'adminacc')
  var res1, res2;
  if(tokenCookie){
    res1 = true;
  } else {
    res1 = false
  }
  if(adminCookie){
    res2 = true
  } else {
    res2 = false
  }
  if(!adminCookie){
    return {
      isLoggedIn: res1,
      isAdmin: res2,
      cid: null,
      username: null
    }
  }
  console.log(' UP ADMIN IT:', JSON.parse(adminCookie!))
  return{
    isLoggedIn: res1,
    isAdmin: res2,
    cid: JSON.parse(adminCookie!).cid.cid.toString(),
    username: JSON.parse(adminCookie!).cid.info.toString(),
    photo: JSON.parse(adminCookie!).photo.toString() ?? '',
  }
})