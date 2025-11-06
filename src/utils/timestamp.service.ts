import moment from 'moment';
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const formater = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  timeZoneName: 'long',
});

function GetDateTimeFormatted(date = new Date) {
  return formater.format(date);
}


function CreateTimestamp() {
  return {
    createdAt: GetDateTimeFormatted(),
    updateAt: GetDateTimeFormatted(),
    editedAt: null,
  };
}

function CreateTimeStampWithExpireisTime(expireTime: number) {
  const currentTime = new Date();
  const expirationTime = currentTime.getTime() + expireTime * 60 * 1000;

  return {
    createdAt: GetDateTimeFormatted(),
    updateAt: GetDateTimeFormatted(),
    editedAt: null,
    expires: expirationTime
  };
}

function GetMonthName(monthIndex: number) {
  return monthNames[monthIndex];
}

function IsFirstDayOfMonth(date: Date) {
  return date.getDate() === 1;
}

function GetPreviousMonthDetails(currentDate: Date) {
  const currentMonthIndex = currentDate.getMonth();
  
  // Se for janeiro ou dezembro, mantém o mês atual; caso contrário, subtrai 1
  const previousMonthIndex = (currentMonthIndex === 0 || currentMonthIndex === 11)
    ? currentMonthIndex
    : currentMonthIndex - 1;
  
  const previousMonthName = GetMonthName(previousMonthIndex).toLowerCase();
  
  return {
    previousMonthIndex: previousMonthIndex,
    previousMonthName: previousMonthName
  };
}


export {
  CreateTimestamp,
  GetDateTimeFormatted,
  CreateTimeStampWithExpireisTime,
  GetMonthName,
  IsFirstDayOfMonth,
  GetPreviousMonthDetails
};