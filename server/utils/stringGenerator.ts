const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//all possible guys up there!!

export function generateRandomID(length: number) {
  let result = ''
  const maxLength = characters.length;
  while(length > 0){
    result += characters.charAt(Math.floor(Math.random() * maxLength))
    length--
  }

  return result
}