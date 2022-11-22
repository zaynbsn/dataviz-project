import { getDataJson, appendData, selectAllDataDivs, show, hide } from './utils.js'

// get data from right json
const url = '/static/mars/data-mars.json'
let marsDataJson = await getDataJson(url)

const mainContainer = document.getElementById("myData")

// append data from json in dom
for(const data in marsDataJson){
  appendData(data, marsDataJson, mainContainer)
}

let scrollbar
let lottieProgress
let allMarkersPositions = []
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
    // console.log(lottieProgress)
    // console.log(lottieProgress.markers)
    for (const marker of lottieProgress.markers){
      allMarkersPositions.push(marker.time * 5.4)
    }
    // console.log(allMarkersPositions)
    // console.log(navbarItems)
    for (let i=0; i < navbarItems.length; i++){
      console.log(navbarItems[i])
      console.log(allMarkersPositions[i])
      navbarItems[i].addEventListener('click', () => {
        scrollbar.scrollTo(0, allMarkersPositions[i], 5000)
        console.log('event fired')
      })
    console.log('event set')
    }

    // scrollbar.scrollTo(0, 156, 2500)
    scrollbar.scrollTo(0, allMarkersPositions[0], 2000) 
    scrollbar.addListener(callback)
  })
}

const marsCallback = (offlim, markers) => {
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

  // if(currentFrame > 20){
  //   lottieProgress.firstFrame = 20;
  // }

  
  // marsDiameter & earthDiameter
  if(scrollPercentRounded > 12 && scrollPercentRounded < 16) {
    show(dataObj.mars_diameter)
    show(dataObj.earth_diameter)
  }else{
    hide(dataObj.mars_diameter)
    hide(dataObj.earth_diameter)
  }

  //mars and earth mass
  if(scrollPercentRounded >= 20  && scrollPercentRounded < 24) {
    show(dataObj.mars_mass)
    show(dataObj.earth_mass)
    show(dataObj.mass_comparison)
  }else{
    hide(dataObj.mars_mass)
    hide(dataObj.earth_mass)
    hide(dataObj.mass_comparison)
  }

  //flight duration
  if(scrollPercentRounded >= 25 && scrollPercentRounded < 30) {
    show(dataObj.flight_duration)
  }else{
    hide(dataObj.flight_duration)
  }
  //rotation
  if(scrollPercentRounded >= 30 && scrollPercentRounded < 35) {
    show(dataObj.mars_rotat)
    show(dataObj.earth_rotat)
  }else{
    hide(dataObj.mars_rotat)
    hide(dataObj.earth_rotat)
  }
  
  //moons
  if(scrollPercentRounded >= 36 && scrollPercentRounded < 41) {
    show(dataObj.phobos)
    show(dataObj.deimos)
    show(dataObj.moon)
  }else{
    hide(dataObj.phobos)
    hide(dataObj.deimos)
    hide(dataObj.moon)
  }
  //earth rotation
  if(scrollPercentRounded >= 52 && scrollPercentRounded < 65) {
    show(dataObj.mars_year_rotat)
    show(dataObj.earth_year_rotat)
  }else{
    hide(dataObj.mars_year_rotat)
    hide(dataObj.earth_year_rotat)
  }
  //temp
  if(scrollPercentRounded >= 83 && scrollPercentRounded < 88 ) {
    show(dataObj.temp_moy)
    show(dataObj.temp_max)
    show(dataObj.temp_min)
  }else{
    hide(dataObj.temp_moy)
    hide(dataObj.temp_max)
    hide(dataObj.temp_min)
  }
  //rovers
  if(scrollPercentRounded >= 92 && scrollPercentRounded < 98 ) {
    show(dataObj.nb_rovers)
  }else{
    hide(dataObj.nb_rovers)
  }

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

launchAnim("./static/mars/mars-v4.json", marsCallback)

