import { getDataJson, appendNavbar, appendData, selectAllDataDivs, changeNavBarActive, show, hide } from './utils.js'

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
  if(scrollPercentRounded > 13 && scrollPercentRounded <= 20) {
    show(dataObj.moon_diameter)
    show(dataObj.earth_diameter)
    show(dataObj.diameter_text)
  }else{
    hide(dataObj.moon_diameter)
    hide(dataObj.earth_diameter)
    hide(dataObj.diameter_text)
  }

  // distance
  if(scrollPercentRounded > 23 && scrollPercentRounded <= 29) {
    show(dataObj.dist_earth_moon)
    show(dataObj.dist_compare_moon)
  }else{
    hide(dataObj.dist_earth_moon)
    hide(dataObj.dist_compare_moon)
  }
  if(scrollPercentRounded > 29 && scrollPercentRounded <= 35) {
    show(dataObj.dist_text)
  }else{
    hide(dataObj.dist_text)
  }

  // first steps & missions
  if(scrollPercentRounded > 48 && scrollPercentRounded <= 52) {
    show(dataObj.first_step_dates)
    show(dataObj.first_step_text)
  }else{
    hide(dataObj.first_step_dates)
    hide(dataObj.first_step_text)
  }
  if(scrollPercentRounded > 52 && scrollPercentRounded <= 58) {
    show(dataObj.missions_text)
  }else{
    hide(dataObj.missions_text)
  }
  
  // gravity
  if(scrollPercentRounded > 64 && scrollPercentRounded <= 73) {
    show(dataObj.moon_gravity)
    show(dataObj.earth_gravity)
    show(dataObj.gravity_text)
  }else{
    hide(dataObj.moon_gravity)
    hide(dataObj.earth_gravity)
    hide(dataObj.gravity_text)
  }

  // periodic cycle
  if(scrollPercentRounded > 75 && scrollPercentRounded <= 98) {
    show(dataObj.periodic_cycle)
  }else{
    hide(dataObj.periodic_cycle)
  }
  if(scrollPercentRounded > 75 && scrollPercentRounded <= 80) {
    show(dataObj.cycle_text_1)
  }else{
    hide(dataObj.cycle_text_1)
  }
  if(scrollPercentRounded > 80 && scrollPercentRounded <= 90) {
    show(dataObj.cycle_text_2)
  }else{
    hide(dataObj.cycle_text_2)
  }
  if(scrollPercentRounded > 90 && scrollPercentRounded <= 98) {
    show(dataObj.cycle_text_3)
  }else{
    hide(dataObj.cycle_text_3)
  }

  if ((scrollPercentage * totalFrames) / 100 < totalFrames) {
    lottieProgress.goToAndStop((scrollPercentage * totalFrames) / 100, true);
  } else {
    return;
  }
}
launchAnim("./static/moon/moon-v1.json", moonCallback)