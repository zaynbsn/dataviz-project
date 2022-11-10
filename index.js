// curseur
const circle=document.querySelector("#night");
const circularcursor=document.querySelector("#circularcursor");
window.addEventListener("mousemove", e => {
    circle.style.top = `${e.clientY-450}px`;
    circle.style.left = `${e.clientX-450}px`;
    circularcursor.style.top = `${e.clientY-16}px`;
    circularcursor.style.left = `${e.clientX-16}px`;
})

// observatoire
// let eyeBall = document.querySelector(".eyeball"),
//     pupil = document.querySelector(".pupil"),
    // eyeArea = eyeBall.getBoundingClientRect(),
    // pupilArea = pupil.getBoundingClientRect(),
    // R = eyeArea.width/2,
    // r = pupilArea.width/2,
    // centerX = eyeArea.left + R,
    // centerY = eyeArea.top + R;

// document.addEventListener("mousemove", (e)=>{
//   let x = e.clientX - centerX,
//       y = e.clientY - centerY,
//       theta = Math.atan2(y,x),
//       angle = theta*180/Math.PI + 90;
  
//   pupil.style.transform = `translateX(${R - r +"px"}) rotate(${angle + "deg"})`;
//   pupil.style.transformOrigin = `${r +"px"} center`;
// });

const astrodex = document.querySelector(".astrodex");
const astrodexModal = document.querySelector(".astrodex-modal");
let isModalDisplayed = false

astrodex.addEventListener('click', e => {
  astrodexModal.style.display = isModalDisplayed ? 'none' : 'block';
  isModalDisplayed = !isModalDisplayed;
})