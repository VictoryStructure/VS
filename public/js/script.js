let nav = 0; 
let clicked = null; 
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];
const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const weekdays = ['Sunday' , 'Monday', 'Tuseday','Wednesday','Thursday', 'Friday','Saturday'];


function openModal(date){
  clicked = date;

const eventForDay = events.find(e => e.date === clicked);

if (eventForDay){
  console.log('Event Exists');
} else {
  newEventModal.style.display = 'block';
}
backDrop.style.display = 'block';
}
function load(){
  const dt = new Date();

  if (nav !== 0){
    dt.setMonth(new Date().getMonth() + nav);
  }
  const day = dt.getDate();
  const month = dt.getMonth();
  const year = dt.getFullYear();
  
  const firstDayOfMonth = new Date(year,month,1);
  const daysInMonth  = new Date(year,month +1, 0).getDate();
  const dateString = firstDayOfMonth.toLocaleDateString('en-us',{
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }
  );
  const paddingDays = weekdays.indexOf(dateString.split(',')[0]);

  document.getElementById('monthDisplay').innerHTML = `${dt.toLocaleDateString('en-us',{month: 'long'})} ${year}`;

  calendar.innerHTML = '';
  for(let i = 1; i<= paddingDays + daysInMonth; i++){
    const daySquare = document.createElement('div');
    daySquare.classList.add('day');
    if(i > paddingDays ){
      daySquare.innerText = i - paddingDays;

      daySquare.addEventListener('click', () => openModal(`${month + 1}/${i-paddingDays}`/{year}));
    }
    else {
      daySquare.classList.add('padding');
    }

    calendar.appendChild(daySquare);

  }
}
// function saveEvent(){
//   if (eventTitleInput.value){
//     eventTitleInput.classList.remove('error');

//     events.push({
//       date:clicked,
//       title: eventTitleInput.value,
//     });

//     localStorage.setItem('events',JSON.stringify('events'));
//   }
//   else {
//     eventTitleInput.classList.add('error');
//   }
// }
function closeModal(){
  newEventModal.style.display = 'none';
  backDrop.style.display = 'none';
  eventTitleInput.style.display = 'none';
  clicked = null;
  load(); 
}
 function initButtons(){
  document.getElementById('nextButton').addEventListener('click', ()=>{
    nav++;
    load();
  });
    document.getElementById('backButton').addEventListener('click', ()=>{
      nav--;
      load();
    }); 
    //document.getElementById('saveButton', saveEvent ).addEventListener('click',saveEvent);
    //document.getElementById('cancelButton', closeModal).addEventListener('click', closeModal);
}
initButtons();
load();
