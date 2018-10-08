function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

function formatTime (date, str='/') {
  let tiem = new Date(date);
  const year = tiem.getFullYear()
  const month = tiem.getMonth() + 1
  const day = tiem.getDate()

  const hour = tiem.getHours()
  const minute = tiem.getMinutes()
  const second = tiem.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join(str)
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

function fixed(value, number) {
  return value.toFixed(number)
}

export default {
  formatNumber,
  formatTime,
  fixed
}
