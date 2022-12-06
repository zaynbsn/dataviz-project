const getDataJson = async (url) => {
  return await fetch(url)
  .then(function (response) {
    return response.json()
  })
  .then(function (data) {
    return data
  })
  .catch(function (err) {
    console.log(err);
  });
}

const appendNavbar = (item, dataJson, navContainer) => {
  let div = document.createElement("div")
  div.classList.add("navbar-item")
  div.classList.add(item)
  if (item === 'mars') div.classList.add('is-active')
  if (item === 'iss') div.classList.add('is-active')
  div.innerHTML =  `<div class="navbar-icons">
                      <img src="./static/icons/${item}.svg"/>
                    </div>
                    <div>
                      <p>${dataJson[item]}</p>
                    </div>`
  navContainer.appendChild(div)
}

const appendData = (data, dataJson, mainContainer) => {
  let value = dataJson[data].value
  let x = dataJson[data].x
  let y = dataJson[data].y
  let size = dataJson[data].size
  let color = dataJson[data].color
  
  let div = document.createElement("div")
  div.classList.add("data")
  div.classList.add(data)
  dataJson[data]['rotate'] ? div.classList.add('rotate45') : ''
  div.style.left = x
  div.style.top = y
  div.style.fontSize = size
  div.style.color = color
  div.innerHTML = `<svg viewBox="0 0 240 80" xmlns="http://www.w3.org/2000/svg"><text x="10" y="50" fill="${color}">` + value + '</text></svg>'
  div.innerHTML = `${value}`
  mainContainer.appendChild(div)
  // div.style.left = "calc(x - (div.offsetWidth / 2)px)"
  // div.style.top = "calc(y - (div.offsetHeight / 2)px)"
}

const selectAllDataDivs = (dataJson) => {
  let dataObj = {}
  for(const data in dataJson){
    dataObj[`${data}`] = document.querySelector(`.${data}`)
  }
  return dataObj
}

const getRatioForNavigation = async (ratio, lottieProgress) => {
  let allMarkersPositions = []
  let count = 4
    for (const marker of lottieProgress.markers){
      allMarkersPositions.push(marker.time * (ratio + count / 10))
      count -= 0.50
    }
    return allMarkersPositions
}

const changeNavBarActive = (currentFrame, markers, index, navbarItems) => {
  if(markers[index+1]){
    if(currentFrame >= markers[index].time-50 && currentFrame <= (markers[index+1].time -50)){
      let currentActive = document.querySelector(".is-active");
      currentActive.classList.remove("is-active")
      navbarItems[index].classList.add("is-active");
    }
  }else if(currentFrame >= markers[index].time-50){
    let currentActive = document.querySelector(".is-active");
      currentActive.classList.remove("is-active")
      navbarItems[index].classList.add("is-active");
  }
  
}

const show = (div) =>{
  div.classList.add('is-visible')
}
const hide = (div) => {
  div.classList.remove('is-visible')
}

const showAndHide = (dataObj, scrollPercentRounded, divArray, min, max) => {
  if(scrollPercentRounded > min && scrollPercentRounded < max) {
    for(const div of divArray){
      show(dataObj[div])
    }
  }else{
    for(const div of divArray){
      hide(dataObj[div])
    }
  }
}

const swapAstrodexModal = (isModalDisplayed, astrodexModal, astrodex) => {
  isModalDisplayed = !isModalDisplayed;
  astrodexModal.style.display = isModalDisplayed ? 'block' : 'none';
  astrodex.style.display = isModalDisplayed ? 'none' : 'block';
  return isModalDisplayed
}

const getRandomCoordinate = () => {
  const top = randomPercentage(0.05, 0.6)
  const right = randomPercentage(0.1, 0.6)
  return [top, right]
}

const randomPercentage = (min, max) => {
  return Math.floor((Math.random() * (max - min) + min) * 100)
}


export { getDataJson, appendNavbar, appendData, selectAllDataDivs, getRatioForNavigation, changeNavBarActive, showAndHide, getRandomCoordinate, swapAstrodexModal }