import { getDataJson, appendNavbar, appendData, selectAllDataDivs, getRatioForNavigation, changeNavBarActive, showAndHide } from './utils.js'
import { appendStaticAstrodexInfos, quizzSetup, appendQuizzContent } from './quizz.js'
import { addAstrodexListeners } from './astrodex.js'

let experiencesDataJson = await getDataJson("./static/experiences.json")
if(localStorage.getItem("experiencesDataJson")){
  experiencesDataJson = JSON.parse(localStorage.getItem("experiencesDataJson"))
}
experiencesDataJson[2].discovered = true
localStorage.setItem("experiencesDataJson", JSON.stringify(experiencesDataJson))

let marsNavData = await getDataJson('./static/mars/nav-mars.json')
const navContainer = document.querySelector(".navbar")


for (const item in marsNavData){
  appendNavbar(item, marsNavData, navContainer)
}

const mainContainer = document.getElementById("myData")

// get data from right json
const url = '../static/mars/data-mars.json'
let marsDataJson = await getDataJson(url)


// append data from json in dom
for(const data in marsDataJson){
  appendData(data, marsDataJson, mainContainer)
}

let scrollbar
let lottieProgress
let allMarkersPositions = []
let isNavClicked = false
let navbarItems = document.querySelectorAll(".navbar-item")
let dataObj = selectAllDataDivs(marsDataJson)

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
    // QUIZZ
    let quizzDataJson = await getDataJson("./static/mars/quizz-mars.json")
    await quizzSetup(quizzDataJson)
    await appendStaticAstrodexInfos("Mars", "./static/Mars.svg")
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
const iconScroll = document.querySelector(".icon-scroll")

const marsCallback = () => {
  let totalHeight = scrollbar.limit.y
  let scrollFromTop = scrollbar.scrollTop
  let totalFrames = lottieProgress.totalFrames
  let currentFrame = lottieProgress.currentFrame
  let scrollPercentage = (scrollFromTop * 100) / totalHeight
  let scrollPercentRounded = Math.round(scrollPercentage)

  if(scrollPercentRounded > 10){
    iconScroll.style.display = 'none'
  }else{
    iconScroll.style.display = 'block'
  }

  if(!isNavClicked){
    for(let i=0; i < navbarItems.length ; i++){
    changeNavBarActive(currentFrame, lottieProgress.markers, i, navbarItems)
    }
  }
  
  showAndHide(dataObj, scrollPercentRounded, ["mars_intro_text"], 4, 8)

  // mars diameter
  showAndHide(dataObj, scrollPercentRounded, ["mars_diameter", "earth_diameter", "diameter_text"], 11, 15)
  
  //mars and earth mass
  showAndHide(dataObj, scrollPercentRounded, ["mass_text"], 18, 23)
  // showAndHide(dataObj, scrollPercentRounded, ["mars_mass", "earth_mass", "mass_text"], 18, 23)
  showAndHide(dataObj, scrollPercentRounded, ["mars_mass9", "earth_mass9"], 23, 26)
  
  //flight duration
  showAndHide(dataObj, scrollPercentRounded, ["flight_duration", "duration_text"], 30, 35)
  
  //rotation
  showAndHide(dataObj, scrollPercentRounded, ["mars_rotat", "earth_rotat", "rotation_text"], 35, 40)
  
  //moons
  showAndHide(dataObj, scrollPercentRounded, ["phobos", "deimos", "moon", "moons_text"], 41, 46)
  
  //earth rotation
  showAndHide(dataObj, scrollPercentRounded, ["place_ss_text"], 54, 57)
  showAndHide(dataObj, scrollPercentRounded, ["solar_rotation_text"], 57, 61)
  showAndHide(dataObj, scrollPercentRounded, ["solar_rotation_text2"], 61, 65)
  showAndHide(dataObj, scrollPercentRounded, ["solar_rotation_text3"], 65, 69)
  
  //temp
  showAndHide(dataObj, scrollPercentRounded, ["temp_text"], 74, 77)
  showAndHide(dataObj, scrollPercentRounded, ["temp_text2"], 77, 80)
  showAndHide(dataObj, scrollPercentRounded, ["temp_text4"], 80, 82)
  showAndHide(dataObj, scrollPercentRounded, ["temp_moy", "temp_max", "temp_min"], 84, 89)
  
  //rovers
  showAndHide(dataObj, scrollPercentRounded, ["rovers_text"], 92, 95)
  showAndHide(dataObj, scrollPercentRounded, ["rovers_text2"], 95, 98)

  if ((scrollPercentage * totalFrames) / 100 < totalFrames) {
    lottieProgress.goToAndStop((scrollPercentage * totalFrames) / 100, true);
  } else {
    return;
  }
}




// ANIM LAUNCH
launchAnim("./static/mars/mars-v-final2.json", marsCallback)

