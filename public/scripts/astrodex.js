import { getDataJson, swapAstrodexModal } from './utils.js'
import { appendStaticAstrodexInfos, resumeSetup, appendResumeContent } from './quizz.js'

// MODAL
let experiencesDataJson = await getDataJson("./static/experiences.json")
if(localStorage.getItem("experiencesDataJson")){
  experiencesDataJson = JSON.parse(localStorage.getItem("experiencesDataJson"))
}

const addAstrodexListeners = () => {
  const astrodex = document.querySelector(".astrodex");
  const astrodexModal = document.querySelector(".astrodex-modal");
  const close = document.querySelector(".close");
  let isModalDisplayed = false
  
  astrodex.addEventListener('click', e => {
    isModalDisplayed = swapAstrodexModal(isModalDisplayed, astrodexModal, astrodex)
  })
  close.addEventListener('click', e => {
    isModalDisplayed = swapAstrodexModal(isModalDisplayed, astrodexModal, astrodex)
  })
}

// CONTENT
const experiences = document.querySelector(".experiences")

if(experiences){
  for(const experience of experiencesDataJson){
    let div = document.createElement("div")
    div.classList.add("experience")
    div.style.width = `calc(100% / ${experiencesDataJson.length})`
    if(experience.discovered){
      div.innerHTML = `<div class="discovered ${experience.name}">
                        <div class="second-layer second-layer-${experience.name}"></div>
                        <div class="third-layer third-layer-${experience.name}"></div>
                        <img src="${experience.asset}"/>
                        <div style="z-index: 11; font-weight: 900;">${experience.trad}</div>
                        <button class="discovered-button ${experience.name}-button">Inspecter</button>
                      </div>`
      experiences.appendChild(div)
      const discovered = document.querySelector(`.${experience.name}`)
      const discoveredButton = document.querySelector(`.${experience.name}-button`)
      const secondLayer = document.querySelector(`.second-layer-${experience.name}`)
      const thirdLayer = document.querySelector(`.third-layer-${experience.name}`)
      // add some style
      discovered.style.backgroundColor = experience.bg_color
      discovered.style.color = experience.title_color
      discoveredButton.style.backgroundColor = experience.button_bg_color
      discoveredButton.style.color = experience.button_text_color
      secondLayer.style.backgroundColor = experience.second_layer_color
      thirdLayer.style.backgroundColor = experience.third_layer_color

      
      let quizzDataJson = await getDataJson(experience.quizz_url_path)
      discoveredButton.addEventListener('click', async () => {
        appendResumeContent(quizzDataJson, 0, experience.trad, experience.asset)
        await appendStaticAstrodexInfos(experience.trad, experience.asset, experience.link_to, experience.summary)
        resumeSetup(quizzDataJson)
      })
    }else{
      div.innerHTML = `<img src="./static/corrupted.svg"/>`
      experiences.appendChild(div)
    } 
  }
}

export { addAstrodexListeners }