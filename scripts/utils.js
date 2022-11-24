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

function show(div){
  div.classList.add('is-visible')
}
function hide(div){
  div.classList.remove('is-visible')
}
function addClass(div, _class){
  div.classList.add(_class)
}
function removeClass(div, _class){
  div.classList.remove(_class)
}


export { getDataJson, appendNavbar, appendData, selectAllDataDivs, changeNavBarActive, show, hide }