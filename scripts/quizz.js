const quizzSetup = (quizzDataJson) => {
  let globalIndex = 0
  
  const previous = document.querySelector('.previous')
  const next = document.querySelector('.next')
  const validate = document. querySelector('.validate')
  
  previous.addEventListener('click', () => {
    validate.classList.remove('failed')
    validate.classList.remove('succeed')
    appendQuizzContent(quizzDataJson, globalIndex-1)
    globalIndex -= 1
    console.log(quizzDataJson)
  })
  next.addEventListener('click', () => {
    validate.classList.remove('failed')
    validate.classList.remove('succeed')
    appendQuizzContent(quizzDataJson, globalIndex+1)
    globalIndex += 1
    console.log(quizzDataJson)
  })
  
  validate.addEventListener('click', () => {
    for (const res of quizzDataJson[globalIndex].data) {
      console.log(res.is_user_response_valid)
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

const appendQuizzContent = (quizzDataJson, index) => {
  const quizz = document.querySelector('.quizz')
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

    const selects = document.querySelectorAll('.select')
    selects.forEach(select => {
      select.addEventListener('change', (event) => {
        if(event.target.value === 'corrupted'){
          sentence.user_response = event.target.value
          sentence.user_response === sentence.valid_answer ? sentence.is_user_response_valid = true : sentence.is_user_response_valid = false
          select.classList.add('minecraft-font')
        }else{
          sentence.user_response = event.target.value
          sentence.user_response === sentence.valid_answer ? sentence.is_user_response_valid = true : sentence.is_user_response_valid = false
          select.classList.remove('minecraft-font')
        }
      });
    })
  }
  const previous = document.querySelector('.previous')
  const next = document.querySelector('.next')
  
  if(quizzDataJson[index - 1]){
    if(previous.style.display = 'none') previous.style.display = 'block'
  }else{
    previous.style.display = 'none'
  }
  if(quizzDataJson[index + 1]){
    if(next.style.display = 'none') next.style.display = 'block'
  }else{
    next.style.display = 'none'
  }
}

export { quizzSetup, appendQuizzContent }