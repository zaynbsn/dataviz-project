import { getDataJson, getRandomCoordinate, swapAstrodexModal } from './scripts/utils.js'

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

// ############################### ASTRODEX ############################

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

const astrodex = document.querySelector(".astrodex");
const astrodexModal = document.querySelector(".astrodex-modal");
let isModalDisplayed = false

const continueCallback = () => {
  const rightDialogue = dialogueJson.find(dialogue => {
    if(dialogue.state === fsm.state) return dialogue
  })
  if(count < rightDialogue.texts.length){
    if(fsm.state === 'storyStart'){
      const svgContainer = document.querySelector(".svg-container")
      if(count === 4){
        svgContainer.style.zIndex = 13
      }
      if(count === 5){
        svgContainer.style.zIndex = 11
        isModalDisplayed = swapAstrodexModal(isModalDisplayed, astrodexModal, astrodex)
      }
      if(count === 6){
        isModalDisplayed = swapAstrodexModal(isModalDisplayed, astrodexModal, astrodex)
      }
    }
    dialogue.innerHTML = `<p class="text-dialogue">${rightDialogue.texts[count]}</p>`
    count += 1
  }else{
    astrobotModal.style.display = 'none'
    dialogueContent.style.display = 'none'
    astrobot.style.display = 'none'
    document.removeEventListener('keydown', continueCallback)
  }
}

const dialogueJson = await getDataJson('./static/dialogues/dialogues.json')
let moonJson = experiencesDataJson.find((exp) => exp.name === 'moon')
let marsJson = experiencesDataJson.find((exp) => exp.name === 'mars')
const astrobotModal = document.querySelector('.astrobot-modal')
const dialogueContent = document.querySelector('.dialogue-content')
const astrobot = document.querySelector(".astrobot")
const dialogue = document.querySelector(".dialogue")
let count = 0

let fsm = new StateMachine({
  init: `start`,
  transitions: [
    { name: 'storyStarting',     from: 'start',  to: 'storyStart' },
    { name: 'hoveringMoon',     from: 'storyStart',  to: 'hoverMoon' },
    { name: 'moonDiscovered',   from: 'start', to: 'moonExp'  },
    { name: 'issDiscovered',   from: 'start', to: 'issExp'  },
    { name: 'marsDiscovered', from: 'start',    to: 'marsExp' },
  ],
  methods: {
    onAfterStoryStarting: function() {storyTelling()},
    onAfterMoonDiscovered:   function() { storyTelling()},
    onAfterIssDiscovered:   function() { storyTelling()},
    onAfterMarsDiscovered:   function() { storyTelling()},
  }
});

const storyTelling = () => {
  count = 0
  astrobotModal.style.display = 'block'
  dialogueContent.style.display = 'block'
  astrobot.style.display = 'block'

  const rightDialogue = dialogueJson.find(dialogue => {
    if(dialogue.state === fsm.state) return dialogue
  })

  dialogue.innerHTML = `<p class="text-dialogue">${rightDialogue.texts[count]}</p>`
  count += 1

  document.addEventListener('keydown', continueCallback)
}

// MOONHOVER STATE
const svgMoon = document.querySelector('.svg-moon')
if(svgMoon){
  svgMoon.addEventListener('mouseenter', async () => {
    if(fsm.state === 'storyStart'){
      count = 0
      fsm.hoveringMoon()
      svgMoon.style.zIndex = 100
      svgMoon.style.transform = 'scale(3)'
      setTimeout(() => {
        astrobotModal.style.display = 'block'
        dialogueContent.style.display = 'block'
        astrobot.style.display = 'block'
      },1000)
      
      const rightDialogue = dialogueJson.find(dialogue => {
        if(dialogue.state === fsm.state) return dialogue
      })
      
      dialogue.innerHTML = `<p class="text-dialogue">${rightDialogue.texts[count]}</p>`
      count += 1
  
      document.addEventListener('keydown', continueCallback)
    }
  })
}

const allDiscovered = experiencesDataJson.filter(exp => exp.discovered === true)
const isLastDiscovered = allDiscovered[allDiscovered.length-1]
console.log(isLastDiscovered)

if(isLastDiscovered){
  if(isLastDiscovered.name === 'moon') fsm.moonDiscovered()
  if(isLastDiscovered.name === 'iss')fsm.issDiscovered()
  if(isLastDiscovered.name === 'mars')fsm.marsDiscovered()
}else{
  fsm.storyStarting()
}