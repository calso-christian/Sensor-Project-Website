const activePage = window.location.pathname;
const navLinks = document.querySelectorAll('nav a').forEach(link =>{
    if(link.href.includes(`${activePage}`)){
        link.classList.add('current');
    }
})


const timeElement = document.querySelector(".time");
const dateElement = document.querySelector(".date");
const meridianElement = document.querySelector(".meridian");

/**
 * @param {Date} date
 */
function formatTime(date) {
  const hours12 = date.getHours() % 12 || 12;
  const minutes = date.getMinutes();
  const isAm = date.getHours() < 12;

  return `${hours12.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${isAm ? "AM" : "PM"}`;
}

function meridian(date) {
    const isAm = date.getHours() < 12;
    return `${isAm ? "AM" : "PM"}`;
  }
/**
 * @param {Date} date
 */
function formatDate(date) {
  const DAYS = [
    "Sun",
    "Mon",
    "Tues",
    "Wed",
    "Thurs",
    "Fri",
    "Sat"
  ];
  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  return `${DAYS[date.getDay()]}, ${
    MONTHS[date.getMonth()]
  } ${date.getDate()} ${date.getFullYear()}`;
}

setInterval(() => {
  const now = new Date();

  timeElement.textContent = formatTime(now);
  dateElement.textContent = formatDate(now);
  meridianElement.textContent = meridian(now);
}, 200);
