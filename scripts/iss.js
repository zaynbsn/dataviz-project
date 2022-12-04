import { getDataJson, appendNavbar, appendData, selectAllDataDivs, getRatioForNavigation, changeNavBarActive, showAndHide, appendStaticAstrodexInfos } from './utils.js'

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
const url = '/static/iss/data-iss.json'
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
    const ratio = scrollbar.limit.y / lottieProgress.totalFrames
    // allMarkersPositions = await getRatioForNavigation(ratio, lottieProgress)

    // for (let i=0; i < navbarItems.length; i++){
    //   navbarItems[i].addEventListener('click', () => {
    //     isNavClicked = true
    //     scrollbar.scrollTo(0, allMarkersPositions[i], 5000)
    //     setTimeout(() => {
    //       isNavClicked = false
    //     }, 10000)
    //     let currentActive = document.querySelector(".is-active");
    //     currentActive.classList.remove("is-active")
    //     navbarItems[i].classList.add("is-active");
    //   })
    // }
    // scrollbar.scrollTo(0, allMarkersPositions[0], 2000) 
    scrollbar.scrollTo(0, 1200, 1000) 
    scrollbar.addListener(callback)
  })
}

const issCallback = () => {
  let totalHeight = scrollbar.limit.y
  let scrollFromTop = scrollbar.scrollTop
  let totalFrames = lottieProgress.totalFrames
  let currentFrame = lottieProgress.currentFrame
  let scrollPercentage = (scrollFromTop * 100) / totalHeight
  let scrollPercentRounded = Math.round(scrollPercentage)

  console.log(scrollPercentRounded)
  // if(!isNavClicked){
  //   for(let i=0; i < 9 ; i++){
  //   changeNavBarActive(currentFrame, lottieProgress.markers, i, navbarItems)
  //   }
  // }
  
  showAndHide(dataObj, scrollPercentRounded, ["build_date_text"], 12, 24)
  showAndHide(dataObj, scrollPercentRounded, ["build_date1"], 12, 43)
  showAndHide(dataObj, scrollPercentRounded, ["build_date2"], 25, 43)
  showAndHide(dataObj, scrollPercentRounded, ["build_date3"], 35, 43)


  showAndHide(dataObj, scrollPercentRounded, ["dist_earth_iss", "dist_earth_iss_text"], 48, 57)
  
  showAndHide(dataObj, scrollPercentRounded, ["rotation_duration", "rotation_duration_text"], 62, 79)
  
  showAndHide(dataObj, scrollPercentRounded, ["duration_earth_iss", "duration_earth_iss_text"], 80, 99)

  if ((scrollPercentage * totalFrames) / 100 < totalFrames) {
    lottieProgress.goToAndStop((scrollPercentage * totalFrames) / 100, true);
  } else {
    return;
  }
}
const astrodex = document.querySelector(".astrodex");
const astrodexModal = document.querySelector(".astrodex-modal");
let isModalDisplayed = false

astrodex.addEventListener('click', e => {
  swapAstrodexModal()
})
// astrodexModal.addEventListener('click', e => {
//   swapAstrodexModal()
// })
const swapAstrodexModal = () => {
  isModalDisplayed = !isModalDisplayed;
  astrodexModal.style.display = isModalDisplayed ? 'block' : 'none';
  astrodex.style.display = isModalDisplayed ? 'none' : 'block';
}

let quizzDataJson = await getDataJson("./static/mars/quizz-mars.json")
console.log(quizzDataJson)

const quizz = document.querySelector('.quizz')

// name and img in astrodex
appendStaticAstrodexInfos("ISS", "./static/ISS.svg")

const appendQuizzContent = (quizzDataJson, index) => {
  quizz.innerHTML = ""
  const quizzObj = quizzDataJson[index].data
  for(const sentence of quizzObj){
    let options = ''
    for (const option of sentence.options){
      options +=  `<option value="${option}" class="hel-font">${option}</option>`
    }
    let div = document.createElement("p")
    div.innerHTML = `${sentence.body_before}
                        <select class="select minecraft-font">
                          <option value="corrupted" class="minecraft-font">${sentence.select}</option>
                          ${options}
                        </select>
                        ${sentence.body_after}`
    
    quizz.appendChild(div)
  }
  const selects = document.querySelectorAll('.select')
  selects.forEach(select => {
    select.addEventListener('change', (event) => {
      if(event.target.value === 'corrupted'){
        select.classList.add('minecraft-font')
      }else{
        select.classList.remove('minecraft-font')
      }
    });
  })
  

  previous.addEventListener('click', () => {
    appendQuizzContent(quizzDataJson, index-1)
  })
  next.addEventListener('click', () => {
    appendQuizzContent(quizzDataJson, index+1)
  })
}
const previous = document.querySelector('.previous')
const next = document.querySelector('.next')

appendQuizzContent(quizzDataJson, 0)

launchAnim("./static/iss/iss-v1.json", issCallback)

