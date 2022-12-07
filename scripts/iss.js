import { getDataJson, appendNavbar, appendData, selectAllDataDivs, getRatioForNavigation, changeNavBarActive, showAndHide } from './utils.js'
import { appendStaticAstrodexInfos, quizzSetup, appendQuizzContent } from './quizz.js'
import { addAstrodexListeners } from './astrodex.js'

let experiencesDataJson = await getDataJson("../static/experiences.json")
if(localStorage.getItem("experiencesDataJson")){
  experiencesDataJson = JSON.parse(localStorage.getItem("experiencesDataJson"))
}
experiencesDataJson[1].discovered = true
localStorage.setItem("experiencesDataJson", JSON.stringify(experiencesDataJson))

let issNavData = await getDataJson('./static/iss/nav-iss.json')
const navContainer = document.querySelector(".navbar")


for (const item in issNavData){
  appendNavbar(item, issNavData, navContainer)
}

const mainContainer = document.getElementById("myData")

// get data from right json
const url = './static/iss/data-iss.json'
let issDataJson = await getDataJson(url)


// append data from json in dom
for(const data in issDataJson){
  appendData(data, issDataJson, mainContainer)
}

let scrollbar
let lottieProgress
let allMarkersPositions = []
let isNavClicked = false
let navbarItems = document.querySelectorAll(".navbar-item")
let dataObj = selectAllDataDivs(issDataJson)

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
    let quizzDataJson = await getDataJson("./static/iss/quizz-iss.json")
    await quizzSetup(quizzDataJson)
    await appendStaticAstrodexInfos("ISS", "./static/ISS.svg")
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
    scrollbar.scrollTo(0, allMarkersPositions[0], 1000) 
    // scrollbar.scrollTo(0, 1200, 1000)
    scrollbar.addListener(callback)
  })
}

const scroll = document.querySelector(".icon-scroll")

const issCallback = () => {
  let totalHeight = scrollbar.limit.y
  let scrollFromTop = scrollbar.scrollTop
  let totalFrames = lottieProgress.totalFrames
  let currentFrame = lottieProgress.currentFrame
  let scrollPercentage = (scrollFromTop * 100) / totalHeight
  let scrollPercentRounded = Math.round(scrollPercentage)
  // console.log(scrollPercentRounded)

  if(scrollPercentRounded > 10){
    scroll.style.display = 'none'
  }else{
    scroll.style.display = 'block'
  }

  if(!isNavClicked){
    for(let i=0; i < navbarItems.length; i++){
    changeNavBarActive(currentFrame, lottieProgress.markers, i, navbarItems)
    }
  }
  
  showAndHide(dataObj, scrollPercentRounded, ["text_intro_name_iss"], 2, 12)

  showAndHide(dataObj, scrollPercentRounded, ["text_intro_iss"], 5, 9)
  showAndHide(dataObj, scrollPercentRounded, ["text_intro_iss2"], 9, 12)
  
  showAndHide(dataObj, scrollPercentRounded, ["build_date1"], 12, 43)
  showAndHide(dataObj, scrollPercentRounded, ["build_date2"], 25, 43)
  showAndHide(dataObj, scrollPercentRounded, ["build_date3"], 35, 43)
  showAndHide(dataObj, scrollPercentRounded, ["build_date_text"], 13, 43)


  showAndHide(dataObj, scrollPercentRounded, ["dist_earth_iss", "dist_earth_iss_text"], 48, 57)
  
  showAndHide(dataObj, scrollPercentRounded, ["rotation_duration", "rotation_duration_text"], 62, 79)
  
  showAndHide(dataObj, scrollPercentRounded, ["duration_earth_iss", "duration_earth_iss_text"], 80, 99)

  if ((scrollPercentage * totalFrames) / 100 < totalFrames) {
    lottieProgress.goToAndStop((scrollPercentage * totalFrames) / 100, true);
  } else {
    return;
  }
}

// QUIZZ


launchAnim("./static/iss/iss-v-final.json", issCallback)

