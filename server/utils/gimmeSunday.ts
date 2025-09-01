export const gimmeSunday = (notSunday: Date) => {
  //first, find sunday
  for(var i = notSunday.getDay(); i > 0; i--){
    notSunday.setDate(notSunday.getDate() - 1) //sends back a day.
  }
  if(notSunday.getDay() !== 0){
    console.log('DAY MATH WRONG FIX IT', notSunday.getDay())
    return notSunday
  } else {
    return notSunday
  }
 }