const date = () => {
  const currentDate = new Date()
  const dateOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  const date = currentDate.toLocaleDateString(config.language, dateOptions)
  document.getElementById('header_date').innerHTML = date
}

const greet = () => {
  const currentTime = new Date()
  const greet = Math.floor(currentTime.getHours() / 6)
  switch (greet) {
    case 0:
      document.getElementById('header_greet').innerHTML = config.greetings.night
      break
    case 1:
      document.getElementById('header_greet').innerHTML =
        config.greetings.morning
      break
    case 2:
      document.getElementById('header_greet').innerHTML =
        config.greetings.afternoon
      break
    case 3:
      document.getElementById('header_greet').innerHTML =
        config.greetings.evening
      break
  }
}

const loadFunctions = async () => {
  date()
  greet()
}
