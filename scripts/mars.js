const url = '/static/data-mars.json'
let marsDataJson = await fetch(url)
  .then(function (response) {
    return response.json()
  })
  .then(function (data) {
    return data
  })
  .catch(function (err) {
    console.log(err);
  });
  
  let mainContainer = document.getElementById("myData")

  appendData('mars_diameter')
  appendData('earth_diameter')
  appendData('mars_mass')
  appendData('earth_mass')
  appendData('mass_comparison')
  appendData('flight_duration')
  appendData('mars_rotat')
  appendData('earth_rotat')
  appendData('phobos')
  appendData('deimos')
  appendData('moon')
  appendData('temp_min')
  appendData('temp_moy')
  appendData('temp_max')


  function appendData(data) {
    let value = marsDataJson[data].value
    let x = marsDataJson[data].x
    let y = marsDataJson[data].y
    let size = marsDataJson[data].size
    let color = marsDataJson[data].color
    
    console.log(value, x, y, size, color)
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
  }

  // import Scrollbar from 'smooth-scrollbar';
  let scrollbar;
  let lottieProgress;
  let previousPercentage = 0;

  const marsDiameter = document.querySelector(".mars_diameter");
  const earthDiameter = document.querySelector(".earth_diameter");
  const marsMass = document.querySelector(".mars_mass");
  const earthMass = document.querySelector(".earth_mass");
  const massComparison = document.querySelector(".mass_comparison");
  const flightDuration = document.querySelector(".flight_duration");
  const marsRotat = document.querySelector(".mars_rotat");
  const earthRotat = document.querySelector(".earth_rotat");
  const phobos = document.querySelector(".phobos");
  const deimos = document.querySelector(".deimos");
  const moon = document.querySelector(".moon");
  const tempMin = document.querySelector(".temp_min");
  const tempMoy = document.querySelector(".temp_moy");
  const tempMax = document.querySelector(".temp_max");

  const launchAnim = (path, callback) => {
    scrollbar = Scrollbar.init(document.querySelector(".container"), {
      renderByPixels: false
    });
    lottieProgress = lottie.loadAnimation({
      container: document.querySelector(".lottie-progress"),
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: path
    });
    scrollbar.addListener(callback);
    scrollbar.scrollTo(0, 110, 3000);
  }

  const marsCallback = () => {
    console.log(lottieProgress)
    let totalHeight = scrollbar.limit.y;
    let scrollFromTop = scrollbar.scrollTop;
    let totalFrames = lottieProgress.totalFrames;
    lottieProgress.curentFrame = 166;
    let currentFrame = Math.round(lottieProgress.currentFrame);
    let scrollPercentage = (scrollFromTop * 100) / totalHeight;
    let scrollPercentRounded = Math.round(scrollPercentage);
    // console.log(scrollPercentRounded);

    console.log(Math.round(lottieProgress.currentFrame))
    
    let delta = previousPercentage - scrollPercentage;
    
    // if(currentFrame > 20){
    //   lottieProgress.firstFrame = 20;
    // }
    
    // marsDiameter & earthDiameter
    if(scrollPercentRounded > 12 && scrollPercentRounded < 16) {
      show(marsDiameter)
      show(earthDiameter)
    }else{
      hide(marsDiameter)
      hide(earthDiameter)
    }

    //mars and earth mass
    if(scrollPercentRounded >= 20  && scrollPercentRounded < 24) {
      show(marsMass)
      show(earthMass)
      show(massComparison)
    }else{
      hide(marsMass)
      hide(earthMass)
      hide(massComparison)
    }

    //flight duration
    if(scrollPercentRounded >= 25 && scrollPercentRounded < 30) {
      show(flightDuration)
    }else{
      hide(flightDuration)
    }
    if(scrollPercentRounded >= 30 && scrollPercentRounded < 35) {
      show(marsRotat)
      show(earthRotat)
    }else{
      hide(marsRotat)
      hide(earthRotat)
    }
    if(scrollPercentRounded >= 36 && scrollPercentRounded < 41) {
      show(phobos)
      show(deimos)
      show(moon)
    }else{
      hide(phobos)
      hide(deimos)
      hide(moon)
    }
    if(scrollPercentRounded >= 83 && scrollPercentRounded < 88 ) {
      show(tempMin)
      show(tempMoy)
      show(tempMax)
    }else{
      hide(tempMin)
      hide(tempMoy)
      hide(tempMax)
    }

    
    if ((scrollPercentage * totalFrames) / 100 < totalFrames) {
      lottieProgress.goToAndStop((scrollPercentage * totalFrames) / 100, true);
    } else {
      return;
    }
    if(scrollPercentRounded === 100 ){
      // Scrollbar.destroyAll();
      scrollbar.destroy();
      scrollbar.removeListener(marsCallback);
      document.querySelector(".lottie-progress").innerHTML = '';
      lottieProgress = null;
      
      previousPercentage = 0;
      launchAnim( "./static/mars-v2.json", marsCallback);
    }

    previousPercentage = scrollPercentage;
  }
  
  launchAnim("./static/mars-v3.json", marsCallback)

  // path: "https://lottie.host/799a8060-05aa-47df-8669-752bbe5687f3/BzD72DF9mt.json"
  //path: "https://lottie.host/937bcaeb-8960-4822-b1b7-8b45be4872aa/WThntv3Pm5.json"
 // path: "https://assets10.lottiefiles.com/packages/lf20_w0cYJr.json"
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

