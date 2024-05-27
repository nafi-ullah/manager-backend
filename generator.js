// program to generate random strings

// declare all characters
const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function generateString(length) {
  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

function getTime(timelen) {
  const date = new Date();
  const offset = 6; 
  const localDate = new Date(date.getTime());
  const hours = localDate.getHours();
  const minutes = localDate.getMinutes();
  const seconds = localDate.getSeconds();
  const currentTime = `${hours}:${minutes}:${seconds}`;
  const timeInHours = `${hours}`;
  const timeInMins = `${hours}:${minutes}`;

  if(timelen == 'hour'){
    return hours;
  }
  else if(timelen == 'mins'){
        return minutes;
  }
   return currentTime;
  //return timeInHours;
}

module.exports = { generateString, getTime };
