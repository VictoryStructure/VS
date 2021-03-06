//ref https://www.youtube.com/watch?v=m9OSBJaQTlM&t=2543
let monthNo = 0;
let clicked = null;
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


function openModal(date) {
  clicked = date;

  const eventForDay = events.find(e => e.date === clicked);

  if (eventForDay) {
    document.getElementById('eventText').innerText = eventForDay.title;
    deleteEventModal.style.display = 'block';
  } else {
    newEventModal.style.display = 'block';
  }

  backDrop.style.display = 'block';
}
//loads up the calendar 
function load() {
  const date = new Date();

  // increments by month
  if (monthNo !== 0) {
    date.setMonth(new Date().getMonth() + monthNo);
  }

  const day = date.getDate();
  const month = date.getMonth();
  const year = date.getFullYear();

  const firstDayOfMonth = new Date(year, month, 1);
  //to get the next month - 1 day (day has to = 0)
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const dateString = firstDayOfMonth.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  //days that dont line up with the month 
  const emptyDays = weekdays.indexOf(dateString.split(', ')[0]);

  // Referenced from https://www.w3docs.com/snippets/javascript/how-to-do-string-interpolation-in-javascript.html
  document.getElementById('monthDisplay').innerText = 
    `${date.toLocaleDateString('en-GB', { month: 'long' })} ${year}`;

// clears out day squares
  calendar.innerHTML = '';
// Rendering the days including the empty days
  for(let i = 1; i <= emptyDays + daysInMonth; i++) {
    const daySquare = document.createElement('div');
    daySquare.classList.add('day');

    const dayString = `${month + 1}/${i - emptyDays}/${year}`;
//renders empty days first and event listens
    if (i > emptyDays) {
      daySquare.innerText = i - emptyDays;
      const eventForDay = events.find(e => e.date === dayString);

      if (i - emptyDays === day && monthNo === 0) {
        daySquare.id = 'currentDay';
      }
      if (eventForDay) {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = eventForDay.title;
        daySquare.appendChild(eventDiv);
      }
      //if click opens event window
      daySquare.addEventListener('click', () => openModal(dayString));
    } else {
      daySquare.classList.add('emptyDays');
    }
    //renders the days within a month
    calendar.appendChild(daySquare);    


    
  }
}
//closes pop up when clicking on event, changing css when close clicked on.
function closeModal() {
  eventTitleInput.classList.remove('error'); 
  newEventModal.style.display = 'none'; 
  deleteEventModal.style.display = 'none';
  backDrop.style.display = 'none';
  eventTitleInput.value = '';
  clicked = null;
  load();
}
// saves into local storage
function saveEvent() {
  if (eventTitleInput.value) {
    eventTitleInput.classList.remove('error');

    events.push({
      date: clicked,
      title: eventTitleInput.value,
    });

    localStorage.setItem('events', JSON.stringify(events));
    closeModal();
  } else {
    eventTitleInput.classList.add('error');
  }
}
// removes event on the day thats clicked. 
function deleteEvent() {
  events = events.filter(e => e.date !== clicked);
  localStorage.setItem('events', JSON.stringify(events));
  closeModal();
}
// initialises buttons 
function initButtons() {
  document.getElementById('nextButton').addEventListener('click', () => {
    monthNo++;
    load();
  });

  document.getElementById('backButton').addEventListener('click', () => {
    monthNo--;
    load();
  });

  document.getElementById('saveButton').addEventListener('click', saveEvent);
  document.getElementById('cancelButton').addEventListener('click', closeModal);
  document.getElementById('deleteButton').addEventListener('click', deleteEvent);
  document.getElementById('closeButton').addEventListener('click', closeModal);
}



initButtons();
load();