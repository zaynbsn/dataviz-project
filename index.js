import { getDataJson, getRandomCoordinate } from './scripts/utils.js'

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
let eyeBall = document.querySelector(".gyalya"),
    pupil = document.querySelector(".pupil"),
    eyeArea = eyeBall.getBoundingClientRect(),
    pupilArea = pupil.getBoundingClientRect(),
    R = eyeArea.width/2,
    r = pupilArea.width/3,
    centerX = eyeArea.left + R,
    centerY = eyeArea.top + R;

document.addEventListener("mousemove", (e)=>{
  let x = e.clientX - centerX,
      y = e.clientY - centerY,
      theta = Math.atan2(y,x),
      angle = theta*180/Math.PI + 30;
  
  pupil.style.transform = `translateX(${R - r +"px"}) rotate(${angle + "deg"})`;
  pupil.style.transformOrigin = `${r +"px"} center`;
});

const astrodex = document.querySelector(".astrodex");
const astrodexModal = document.querySelector(".astrodex-modal");
let isModalDisplayed = false

astrodex.addEventListener('click', e => {
  swapAstrodexModal()
})
astrodexModal.addEventListener('click', e => {
  swapAstrodexModal()
})

const swapAstrodexModal = () => {
  isModalDisplayed = !isModalDisplayed;
  astrodexModal.style.display = isModalDisplayed ? 'block' : 'none';
  astrodex.style.display = isModalDisplayed ? 'none' : 'block';
}
// ############################### ASTRODEX ############################
const astrodexContent = document.querySelector(".astrodex-content")

let experiencesDataJson = await getDataJson("./static/experiences.json")
if(localStorage.getItem("experiencesDataJson")){
  experiencesDataJson = JSON.parse(localStorage.getItem("experiencesDataJson"))
}

// randomize planet position
const body = document.body
const expToDiscover = experiencesDataJson.find((exp) => exp.discovered === false)
if(expToDiscover){
  let div = document.createElement("div")
  const coordinate = getRandomCoordinate()
  div.style.top = coordinate[0]
  div.style.right = coordinate[1]
  div.style.position = 'absolute'

  div.innerHTML = `<a href="${expToDiscover.link_to}">
                    <img src="${expToDiscover.asset}" class="svg-${expToDiscover.name}" />
                  </a>`
  body.appendChild(div)
}else{
  // if all discovered
  const coordinatesArray = []
  for (const exp of experiencesDataJson){
    let div = document.createElement("div")

    const coordinate = getRandomCoordinate()
    for (const tuple of coordinatesArray){
      while(tuple[0]-3 <= coordinate[0] && coordinate[0] <= tuple[0]+3 && tuple[1]-3 <= coordinate[1] && coordinate[1] <= tuple[1]+3){
        coordinate = getRandomCoordinate()
      }
    }
    coordinatesArray.push(coordinate)
    div.style.top = coordinate[0]
    div.style.right = coordinate[1]
    div.style.position = 'absolute'
    div.innerHTML = `<a href="${exp.link_to}">
                      <img src="${exp.asset}" class="svg-${exp.name}" />
                    </a>`
    body.appendChild(div)
  }
}   
// let moonJson = experiencesDataJson.find((exp) => exp.name === 'moon')
// let marsJson = experiencesDataJson.find((exp) => exp.name === 'mars')

const experiences = document.querySelector(".experiences")

for(const experience of experiencesDataJson){
  let div = document.createElement("div")
  div.classList.add("experience")
  div.style.width = `calc(100% / ${experiencesDataJson.length})`
  if(experience.discovered){
    div.innerHTML = `<div class="discovered ${experience.name}">
                      <img src="${experience.asset}"/>
                      <h1>${experience.name.toUpperCase()}</h1>
                      <a href="${experience.link_to}">
                        <button class="discovered-button ${experience.name}-button">Inspecter</button>
                      </a>
                    </div>`
    experiences.appendChild(div)
    const discovered = document.querySelector(`.${experience.name}`)
    const discoveredButton = document.querySelector(`.${experience.name}-button`)
    discovered.style.backgroundColor = experience.bg_color
    discovered.style.color = experience.title_color
    discoveredButton.style.backgroundColor = experience.button_bg_color
    discoveredButton.style.color = experience.button_text_color
  }else{
    div.innerHTML = `<img src="./static/corrupted.svg"/>`
    experiences.appendChild(div)
  } 
}