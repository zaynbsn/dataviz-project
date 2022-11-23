import { getDataJson, appendData, selectAllDataDivs, changeNavBarActive, show, hide } from './utils.js'

let marsNavData = await getDataJson('/static/mars/nav-mars.json')
const navContainer = document.querySelector(".navbar")

for (const item in marsNavData){
  let div = document.createElement("div")
  div.classList.add("navbar-item")
  div.classList.add(item)
  if (item === 'mars') div.classList.add('is-active')
  div.innerHTML =  `<div class="navbar-icons">
                      <img src="./static/icons/${item}.svg"/>
                    </div>
                    <div>
                      <p>${marsNavData[item]}</p>
                    </div>`
  navContainer.appendChild(div)
}

const mainContainer = document.getElementById("myData")

// let marsTextsJson = await getDataJson('/static/mars/texts-mars.json')

// get data from right json
const url = '/static/mars/data-mars.json'
let marsDataJson = await getDataJson(url)
// console.log('marsDataJson', marsDataJson)


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
    console.log(scrollbar.size)
    for (const marker of lottieProgress.markers){
      allMarkersPositions.push(marker.time * 5)
    }
    for (let i=0; i < navbarItems.length; i++){
      navbarItems[i].addEventListener('click', async () => {
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
  if(scrollPercentRounded > 4 && scrollPercentRounded <= 8) {
    show(dataObj.mars_intro_text)
  }else{
    hide(dataObj.mars_intro_text)
  }
  
  // marsDiameter & earthDiameter
  if(scrollPercentRounded > 11 && scrollPercentRounded < 15) {
    show(dataObj.mars_diameter)
    show(dataObj.earth_diameter)
    show(dataObj.diameter_text)
  }else{
    hide(dataObj.mars_diameter)
    hide(dataObj.earth_diameter)
    hide(dataObj.diameter_text)
  }
  if(!isNavClicked){
    for(let i=0; i < 8 ; i++){
    changeNavBarActive(currentFrame, lottieProgress.markers, i, navbarItems)
    }
  }

  
  //mars and earth mass
  if(scrollPercentRounded >= 18  && scrollPercentRounded < 23) {
    show(dataObj.mars_mass)
    show(dataObj.earth_mass)
    show(dataObj.mass_text)
  }else{
    hide(dataObj.mars_mass)
    hide(dataObj.earth_mass)
    hide(dataObj.mass_text)
  }
  
  //flight duration
  if(scrollPercentRounded >= 31 && scrollPercentRounded < 35) {
    show(dataObj.flight_duration)
    show(dataObj.duration_text)
  }else{
    hide(dataObj.flight_duration)
    hide(dataObj.duration_text)
  }
  //rotation
  if(scrollPercentRounded >= 35 && scrollPercentRounded < 40) {
    show(dataObj.mars_rotat)
    show(dataObj.earth_rotat)
    show(dataObj.rotation_text)
  }else{
    hide(dataObj.mars_rotat)
    hide(dataObj.earth_rotat)
    hide(dataObj.rotation_text)
  }
  
  //moons
  if(scrollPercentRounded >= 41 && scrollPercentRounded < 46) {
    show(dataObj.phobos)
    show(dataObj.deimos)
    show(dataObj.moon)
    show(dataObj.moons_text)
  }else{
    hide(dataObj.phobos)
    hide(dataObj.deimos)
    hide(dataObj.moon)
    hide(dataObj.moons_text)
  }
  //earth rotation
  if(scrollPercentRounded >= 56 && scrollPercentRounded < 62) {
    show(dataObj.place_ss_text)
  }else{
    hide(dataObj.place_ss_text)
  }
  if(scrollPercentRounded >= 62 && scrollPercentRounded < 69) {
    show(dataObj.solar_rotation_text)
  }else{
    hide(dataObj.solar_rotation_text)
  }

  if(scrollPercentRounded >= 74 && scrollPercentRounded < 82 ) {
    show(dataObj.temp_text)
  }else{
    hide(dataObj.temp_text)
  }
  //temp
  if(scrollPercentRounded >= 84 && scrollPercentRounded < 89 ) {
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
    // show(dataObj.nb_rovers)
    show(dataObj.rovers_text)
  }else{
    // hide(dataObj.nb_rovers)
    hide(dataObj.rovers_text)
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

launchAnim("./static/mars/mars-v-final.json", marsCallback)

