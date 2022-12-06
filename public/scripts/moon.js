import { getDataJson, appendNavbar, appendData, selectAllDataDivs, getRatioForNavigation, changeNavBarActive, showAndHide } from './utils.js'
import { appendStaticAstrodexInfos, quizzSetup, appendQuizzContent } from './quizz.js'
import { addAstrodexListeners } from './astrodex.js'

// STORYTELLING ET EXPLICATIONS
const dialogueJson = await getDataJson("./static/dialogues/moon-dialogue.json")
const astrobotModal = document.querySelector('.astrobot-modal')
const dialogueContent = document.querySelector('.dialogue-content')
const astrobot = document.querySelector(".astrobot")
const dialogue = document.querySelector(".dialogue")
let count = 0
const continueCallback = () => {
  if(count < dialogueJson[0].texts.length){
    dialogue.innerHTML = `<p class="text-dialogue">${dialogueJson[0].texts[count]}</p>`
    count += 1
  }else{
    astrobotModal.style.display = 'none'
    dialogueContent.style.display = 'none'
    astrobot.style.display = 'none'
    document.removeEventListener('keydown', continueCallback)
  }
}
const storyTelling = () => {
  count = 0
  astrobotModal.style.display = 'block'
  dialogueContent.style.display = 'block'
  astrobot.style.display = 'block'

  console.log(dialogueJson)

  dialogue.innerHTML = `<p class="text-dialogue">${dialogueJson[0].texts[count]}</p>`
  count += 1

  document.addEventListener('keydown', continueCallback)
}

let experiencesDataJson = await getDataJson("./static/experiences.json")
if(localStorage.getItem("experiencesDataJson")){
  experiencesDataJson = JSON.parse(localStorage.getItem("experiencesDataJson"))
}
if(experiencesDataJson[0].discovered === false){
  storyTelling()
}

experiencesDataJson[0].discovered = true
localStorage.setItem("experiencesDataJson", JSON.stringify(experiencesDataJson))

let moonNavData = await getDataJson('/static/moon/nav-moon.json')
const navContainer = document.querySelector(".navbar")

for (const item in moonNavData){
  appendNavbar(item, moonNavData, navContainer)
}

const mainContainer = document.getElementById("myData")

// get data from right json
const url = '/static/moon/data-moon.json'
let moonDataJson = await getDataJson(url)


// append data from json in dom
for(const data in moonDataJson){
  appendData(data, moonDataJson, mainContainer)
}

let scrollbar
let lottieProgress
let allMarkersPositions = []
let isNavClicked = false
let navbarItems = document.querySelectorAll(".navbar-item")

// select all divs
let dataObj = selectAllDataDivs(moonDataJson)

const launchAnim = async (path, callback) => {

  scrollbar = Scrollbar.init(document.querySelector(".container"), {
    renderByPixels: false
  });
  lottieProgress = lottie.loadAnimation({
    container: document.querySelector(".lottie-progress"),
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: path
  })
  lottieProgress.addEventListener('data_ready', async ()  => {
    let quizzDataJson = await getDataJson("./static/moon/quizz-moon.json")
    await quizzSetup(quizzDataJson)
    await appendStaticAstrodexInfos("La Lune", "./static/Moon.svg")
    await appendQuizzContent(quizzDataJson, 0)
    addAstrodexListeners()

    const ratio = scrollbar.limit.y / lottieProgress.totalFrames
    allMarkersPositions = await getRatioForNavigation(ratio, lottieProgress)
    
    for (let i=0; i < navbarItems.length; i++){
      navbarItems[i].addEventListener('click', () => {
        isNavClicked = true
        scrollbar.scrollTo(0, allMarkersPositions[i], 5000)
        setTimeout(() => {
          isNavClicked = false
        }, 10000)
        let currentActive = document.querySelector(".is-active");
        currentActive.classList.remove("is-active")
        navbarItems[i].classList.add("is-active");
      })
    }
    scrollbar.scrollTo(0, allMarkersPositions[0], 2000) 
    scrollbar.addListener(callback)
  })
}

const scroll = document.querySelector(".icon-scroll")

const moonCallback = () => {
  let totalHeight = scrollbar.limit.y
  let scrollFromTop = scrollbar.scrollTop
  let totalFrames = lottieProgress.totalFrames
  let currentFrame = lottieProgress.currentFrame
  let scrollPercentage = (scrollFromTop * 100) / totalHeight
  let scrollPercentRounded = Math.round(scrollPercentage)

  if(scrollPercentRounded > 10){
    scroll.style.display = 'none'
  }else{
    scroll.style.display = 'block'
  }
  
  if(!isNavClicked){
    for(let i=0; i < navbarItems.length ; i++){
      changeNavBarActive(currentFrame, lottieProgress.markers, i, navbarItems)
    }
  }

  // moon diameter
  showAndHide(dataObj, scrollPercentRounded, ["moon_diameter", "earth_diameter", "diameter_text"], 13, 20)
  
  // distance
  showAndHide(dataObj, scrollPercentRounded, ["dist_earth_moon", "dist_compare_moon"], 23, 29)
  showAndHide(dataObj, scrollPercentRounded, ["dist_text"], 29, 35)
  
  // first steps & missions
  showAndHide(dataObj, scrollPercentRounded, ["first_step_dates", "first_step_text"], 48, 52)
  showAndHide(dataObj, scrollPercentRounded, ["missions_text"], 52, 58)
  
  // gravity
  showAndHide(dataObj, scrollPercentRounded, ["moon_gravity", "earth_gravity", "gravity_text"], 64, 73)
  
  // periodic cycle
  showAndHide(dataObj, scrollPercentRounded, ["periodic_cycle"], 75, 98)
  showAndHide(dataObj, scrollPercentRounded, ["cycle_text_1"], 75, 80)
  showAndHide(dataObj, scrollPercentRounded, ["cycle_text_2"], 80, 90)
  showAndHide(dataObj, scrollPercentRounded, ["cycle_text_3"], 90, 98)

  if ((scrollPercentage * totalFrames) / 100 < totalFrames) {
    lottieProgress.goToAndStop((scrollPercentage * totalFrames) / 100, true);
  } else {
    return;
  }
}



launchAnim("./static/moon/moon-v-final2.json", moonCallback)