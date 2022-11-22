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

const appendData = (data, marsDataJson, mainContainer) => {
  let value = marsDataJson[data].value
  let x = marsDataJson[data].x
  let y = marsDataJson[data].y
  let size = marsDataJson[data].size
  let color = marsDataJson[data].color
  
  let div = document.createElement("div")
  div.classList.add("data")
  div.classList.add(data)
  marsDataJson[data]['rotate'] ? div.classList.add('rotate45') : ''
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

const selectAllDataDivs = (marsDataJson) => {
  let dataObj = {}
  for(const data in marsDataJson){
    dataObj[`${data}`] = document.querySelector(`.${data}`)
  }
  return dataObj
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


export { getDataJson, appendData, selectAllDataDivs, show, hide }