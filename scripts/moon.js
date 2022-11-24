import { getDataJson, appendNavbar, appendData, selectAllDataDivs, changeNavBarActive, showAndHide } from './utils.js'

let experiencesDataJson = await getDataJson("./static/experiences.json")
if(localStorage.getItem("experiencesDataJson")){
  experiencesDataJson = JSON.parse(localStorage.getItem("experiencesDataJson"))
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
  console.log(lottieProgress)
  lottieProgress.addEventListener('data_ready', ()  => {
    for (const marker of lottieProgress.markers){
      allMarkersPositions.push(marker.time * 5.67)
    }
    for (let i=0; i < navbarItems.length; i++){
      navbarItems[i].addEventListener('click', () => {
        isNavClicked = true
        scrollbar.scrollTo(0, allMarkersPositions[i], 5000)
        setTimeout(() => {
          isNavClicked = false
        }, 6000)
        let currentActive = document.querySelector(".is-active");
        currentActive.classList.remove("is-active")
        navbarItems[i].classList.add("is-active");
      })
    }
    scrollbar.scrollTo(0, allMarkersPositions[0], 2000) 
    scrollbar.addListener(callback)
  })
}
const moonCallback = () => {
  let totalHeight = scrollbar.limit.y
  let scrollFromTop = scrollbar.scrollTop
  let totalFrames = lottieProgress.totalFrames
  let currentFrame = lottieProgress.currentFrame
  let scrollPercentage = (scrollFromTop * 100) / totalHeight
  let scrollPercentRounded = Math.round(scrollPercentage)

  if(!isNavClicked){
    for(let i=0; i < 7 ; i++){
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
launchAnim("./static/moon/moon-v1.json", moonCallback)