const win = window.location.href.toString().split(window.location.host)[1]
const subwin = win.substring(1, win.length)

const appendStaticAstrodexInfos = async (name, svgPath, pageUrl, downloadLink) => {
  // quizz static img
  const expSvg = document.querySelector('.exp-svg')
  if(expSvg) expSvg.src = svgPath

  // title quizz
  const titleQuizz = document.querySelector('.quizz-title')
  titleQuizz.innerHTML = `<h1>${name}</h1>`

  // view anim
  const animButtonLink = document.querySelector(".anim-button-link")

  if(animButtonLink) animButtonLink.href = pageUrl

  // download
  const download = document.querySelector(".download-link")
  if(download) download.href = downloadLink
}

const quizzSetup = async (quizzDataJson) => {
  let globalIndex = 0
  
  const previous = document.querySelector('.previous')
  const next = document.querySelector('.next')
  const validate = document. querySelector('.validate')
  
  previous.addEventListener('click', async () => {
    validate.classList.remove('failed')
    validate.classList.remove('succeed')
    await appendQuizzContent(quizzDataJson, globalIndex-1)
    globalIndex -= 1
  })
  next.addEventListener('click', async () => {
    validate.classList.remove('failed')
    validate.classList.remove('succeed')
    await appendQuizzContent(quizzDataJson, globalIndex+1)
    globalIndex += 1
  })
  
  validate.addEventListener('click', () => {
    if(localStorage.getItem(`quizzDataJson-${subwin}`)){
      quizzDataJson = JSON.parse(localStorage.getItem(`quizzDataJson-${subwin}`))
    }
    for (const res of quizzDataJson[globalIndex].data) {
      if (!res.is_user_response_valid){
        validate.classList.add('failed')
        validate.classList.remove('succeed')
        return false
      }
    }
    validate.classList.add('succeed')
    validate.classList.remove('failed')
    return true
  })
}
const resumeSetup = (quizzDataJson) => {
  let globalIndex = 0
  const previous = document.querySelector('.previous')
  const next = document.querySelector('.next')
  
  previous.addEventListener('click', () => {
    appendResumeContent(quizzDataJson, globalIndex-1)
    globalIndex -= 1
  })
  next.addEventListener('click', () => {
    appendResumeContent(quizzDataJson, globalIndex+1)
    globalIndex += 1
  })
}

const appendQuizzContent = async (quizzDataJson, index) => {
  const validatebtn = document.querySelector('.validate')
  if(localStorage.getItem(`quizzDataJson-${subwin}`)){
    quizzDataJson = JSON.parse(localStorage.getItem(`quizzDataJson-${subwin}`))
  }
  const quizz = document.querySelector('.quizz')
  quizz.innerHTML = ""
  let quizzObj = quizzDataJson[index].data
  for(const sentence of quizzObj){
    validatebtn.style.display = "flex"
    if(sentence.is_user_response_valid){

    }
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

    if(sentence.is_user_response_valid){
      div.innerHTML = `${sentence.body_before} ${sentence.valid_answer} ${sentence.body_after}`
      validatebtn.style.display = "none"
    }
    quizz.appendChild(div)

    const selects = document.querySelectorAll('.select')
    selects.forEach(select => {
      select.addEventListener('change', (event) => {
        if(event.target.value === 'corrupted'){
          sentence.user_response = event.target.value
          sentence.user_response === sentence.valid_answer ? sentence.is_user_response_valid = true : sentence.is_user_response_valid = false
          select.classList.add('minecraft-font')
          localStorage.setItem(`quizzDataJson-${subwin}`, JSON.stringify(quizzDataJson))
        }else{
          sentence.user_response = event.target.value
          sentence.user_response === sentence.valid_answer ? sentence.is_user_response_valid = true : sentence.is_user_response_valid = false
          select.classList.remove('minecraft-font')
          localStorage.setItem(`quizzDataJson-${subwin}`, JSON.stringify(quizzDataJson))
        }
      });
    })
  }
  const previous = document.querySelector('.previous')
  const next = document.querySelector('.next')
  
  if(quizzDataJson[index - 1]){
    previous.removeAttribute('disabled')
    previous.style.opacity = '1'
  }else{
    previous.setAttribute('disabled', '')
    previous.style.opacity = '0.3'
  }
  if(quizzDataJson[index + 1]){
    next.removeAttribute('disabled')
    next.style.opacity = '1'
  }else{
    next.setAttribute('disabled', '')
    next.style.opacity = '0.3'
  }
}

const appendResumeContent = (quizzDataJson, index) => {
  const pres = document.querySelector('.presentation')
  const exps = document.querySelector('.experiences')
  const quizzContent = document.querySelector(".quizz-content")
  const illustrationQuizz = document.querySelector(".illustration-quizz")
  const returnButton = document.querySelector(".return")
  returnButton.addEventListener('click', () => {
    if(quizzContent) quizzContent.style.display = "none"
    if(illustrationQuizz) illustrationQuizz.style.display = "none"
    pres.style.display = "flex"
    exps.style.display = "flex"
  })
  if(pres) pres.style.display = "none"
  if(exps) exps.style.display = "none"
  quizzContent.style.display = "flex"
  illustrationQuizz.style.display = "flex"

  const quizz = document.querySelector(".quizz")

  const quizzObj = quizzDataJson[index].data
  
  let fullSentence = ''
  for(const sentence of quizzObj){
    fullSentence += `${sentence.body_before} ${sentence.valid_answer} ${sentence.body_after}`
  }
  quizz.innerHTML = `<p>${ fullSentence }</p>`

  const previous = document.querySelector('.previous')
  const next = document.querySelector('.next')
  
  if(quizzDataJson[index - 1]){
    previous.removeAttribute('disabled')
    previous.style.opacity = '1'
  }else{
    previous.setAttribute('disabled', '')
    previous.style.opacity = '0.3'
  }
  if(quizzDataJson[index + 1]){
    next.removeAttribute('disabled')
    next.style.opacity = '1'
  }else{
    next.setAttribute('disabled', '')
    next.style.opacity = '0.3'
  }
}

export { appendStaticAstrodexInfos, quizzSetup, resumeSetup, appendQuizzContent, appendResumeContent }