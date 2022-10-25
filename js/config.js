
const mainContainer = creatElement('div',
{ className: 'main-container' });

const formContainer = creatElement('div',
{ className: 'form-container' });

const resultsContainer = creatElement('div',
{ className: 'results-container', });


window.onload = async function () {

const marContainer = document.querySelector('.contain-marquee');
const marquee = new Marquee(marContainer);

marquee.start();

const resultsSearch = new ResultsSearch(resultsContainer);

const search = new Search(formContainer, resultsSearch);

createMain();
};


function createMain() {
mainContainer.append(formContainer, resultsContainer);
document.body.append(mainContainer);
}



const getPercenInfo = profileNum => {
  
  let percentage = {};
  percentage.num = profileNum;
  percentage.text = parseFloat(percentage.num).toFixed(2) + '%';
  percentage.Sign; percentage.Css;

  if (percentage.num >= 0) {
    percentage.Sign = '+'; percentage.Css = 'up0';
  } else {
    percentage.Sign = ''; percentage.Css = 'down0';
  }
  return percentage;
};

async function getJson(apiUrl) {
  let response = await fetch(apiUrl);
  if (!response.ok) {
    return alert('Poor server response', response);
  }
  let data = await response.json();
  if (!data) {
    return console.warn('No data receving from server');
  }
  return data;
}


const getProfilOfComp = async symbol => {

  const searchUrl = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol}`;

  const data = await getJson(searchUrl);

  if (!data || !data.profile) {
    return console.warn("No Result Found - Data Profile");
  }
  const profile = data.profile;
  return profile;
};


const getCssSign = num => {
  let sign;
  if (num >= 0) {
    sign = 'up0';
  } else {
    sign = 'down0';
  }
  return sign;
};




const splitSearch = (text, pattern) => {

  const regularExp = new RegExp(pattern, 'ig');

  const matches = text.matchAll(regularExp);

  const allMatched = [];

  let endOfPrev = 0;


  for (const hit of matches) {
    let pos = hit.index;
    let end = pos + pattern.length;

    let before = text.substring(endOfPrev, pos);
    let inside = hit[0];

    allMatched.push({ before, inside, pos });
    endOfPrev = end;
  }


  let after = text.substring(endOfPrev);

  return {
    hits: allMatched,
    after,
    text,
  };
};

function fixMisImg(imgDom) {
  imgDom.addEventListener('error', () => {
    imgDom.src = './img/missing-img.jpg';
    return true;
  });
}

function creatElement(type, theOptions) {
  const theDom = document.createElement(type);
  if (!theOptions)
    return theDom;
  Object.assign(theDom, theOptions);
  return theDom;
}