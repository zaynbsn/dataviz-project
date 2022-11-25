import { getDataJson, appendNavbar, appendData, selectAllDataDivs, changeNavBarActive, showAndHide } from './utils.js'

let experiencesDataJson = await getDataJson("./static/experiences.json")
if(localStorage.getItem("experiencesDataJson")){
  experiencesDataJson = JSON.parse(localStorage.getItem("experiencesDataJson"))
}
experiencesDataJson[1].discovered = true
localStorage.setItem("experiencesDataJson", JSON.stringify(experiencesDataJson))

let marsNavData = await getDataJson('/static/mars/nav-mars.json')
const navContainer = document.querySelector(".navbar")


for (const item in marsNavData){
  appendNavbar(item, marsNavData, navContainer)
}

const mainContainer = document.getElementById("myData")

// get data from right json
const url = '/static/mars/data-mars.json'
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

// console.log('navbarItems', navbarItems)
// select all divs
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

  lottieProgress.addEventListener('data_ready', ()  => {
    console.log(lottieProgress)
    for (const marker of lottieProgress.markers){
      allMarkersPositions.push(marker.time * 5)
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
        // let svgSrc = navbarItems[i].children[0].children[0].src
        // console.log('navbarItems', navbarItems[i])
        // console.log(marsNavData)
        // console.log(svgSrc) 
      })
    }
    scrollbar.scrollTo(0, allMarkersPositions[0], 2000) 
    scrollbar.addListener(callback)
  })
}

const marsCallback = () => {
  let totalHeight = scrollbar.limit.y
  let scrollFromTop = scrollbar.scrollTop
  let totalFrames = lottieProgress.totalFrames
  let currentFrame = lottieProgress.currentFrame
  let scrollPercentage = (scrollFromTop * 100) / totalHeight
  let scrollPercentRounded = Math.round(scrollPercentage)
  // console.log("currentFrame", currentFrame)
  // console.log('scrollFromTop', scrollFromTop)
  // console.log('totalHeight', totalHeight)
  // console.log('markers', allMarkersPositions)
  // console.log("------------------------")
  // console.log(scrollPercentRounded)

  // if(currentFrame > 20){
  //   lottieProgress.firstFrame = 20;
  // }

  if(!isNavClicked){
    for(let i=0; i < 9 ; i++){
    changeNavBarActive(currentFrame, lottieProgress.markers, i, navbarItems)
    }
  }
  
  showAndHide(dataObj, scrollPercentRounded, ["mars_intro_text"], 4, 8)

  // mars diameter
  showAndHide(dataObj, scrollPercentRounded, ["mars_diameter", "earth_diameter", "diameter_text"], 11, 15)
  
  //mars and earth mass
  showAndHide(dataObj, scrollPercentRounded, ["mars_mass", "earth_mass", "mass_text"], 18, 23)
  
  //flight duration
  showAndHide(dataObj, scrollPercentRounded, ["flight_duration", "duration_text"], 31, 35)
  
  //rotation
  showAndHide(dataObj, scrollPercentRounded, ["mars_rotat", "earth_rotat", "rotation_text"], 35, 40)
  
  //moons
  showAndHide(dataObj, scrollPercentRounded, ["phobos", "deimos", "moon", "moons_text"], 41, 46)
  
  //earth rotation
  showAndHide(dataObj, scrollPercentRounded, ["place_ss_text"], 56, 62)
  showAndHide(dataObj, scrollPercentRounded, ["solar_rotation_text"], 62, 69)
  
  //temp
  showAndHide(dataObj, scrollPercentRounded, ["temp_text"], 74, 82)
  showAndHide(dataObj, scrollPercentRounded, ["temp_moy", "temp_max", "temp_min"], 84, 89)
  
  //rovers
  showAndHide(dataObj, scrollPercentRounded, ["rovers_text"], 92, 98)

  if ((scrollPercentage * totalFrames) / 100 < totalFrames) {
    lottieProgress.goToAndStop((scrollPercentage * totalFrames) / 100, true);
  } else {
    return;
  }

  // --------------------LOOP---------------------
  // if(scrollPercentRounded === 100 ){
  //   // Scrollbar.destroyAll();
  //   scrollbar.destroy();
  //   scrollbar.removeListener(marsCallback);
  //   document.querySelector(".lottie-progress").innerHTML = '';
  //   lottieProgress = null;
    
  //   launchAnim( "./static/mars/mars-v4.json", marsCallback);
  // }
}

launchAnim("./static/mars/mars-v-final.json", marsCallback)

