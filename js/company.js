

const globalContainer = creatElement('div', { className: 'global-container' });

const profileContainer = creatElement('div', { className: 'profile-container' });

const graphContainer = creatElement('div', { className: 'graph-container' });


globalContainer.append(profileContainer, graphContainer);
document.body.append(globalContainer);

function getSymbol() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const symbolValue = urlSearchParams.get('symbol') || 'AAPL';
  return symbolValue;
}



const getStockPriceHistory = async symbol => {
  const searchUrl = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${symbol}?serietype=line&timeseries=60`;
  const data = await getJson(searchUrl);
  if (!data || !data.historical) {
    return console.warn("Not Found Result - Data Historical");
  }
  const historical = data.historical;
  printStockHistory(historical);
};

function printStockHistory(historical) {
  historical = historical.reverse();
  closePrice = historical.map(x => x.close);
  closeDate = historical.map(x => x.date);

  const graphConfig = {
    type: 'line',
    data: {
      labels: closeDate,
      datasets: [
        {
          fill: {
            target: 'origin',
          },
          label: 'Stock Price History',
          backgroundColor: 'rgba(156, 120, 100, 0.8)',
          borderColor: 'rgb(156, 120, 100)',
          data: closePrice,
        },],
    },
  };

  const graphArea = creatElement('canvas');
  graphContainer.append(graphArea);
  const mygraph = new Chart(graphArea, graphConfig);
};

window.onload = async function () {
  const symbolParam = getSymbol();
  const profile = await getProfilOfComp(symbolParam);

  creatProfilStock(profile);

  const stock = getStockPriceHistory(symbolParam);

  Promise.all([profile, stock]).then(() => {
    document.querySelector('.loader-jump').classList.add('hidden');
  });
};

function creatProfilStock(compProfile) {
  const titleContainer = creatElement('div', {
    className: 'title-container',
  });

  const infoContainer = creatElement('div', {
    className: 'detail-container',
  });

  const companyImg = creatElement('img', {
    className: 'company-img',
    src: compProfile.image,
    alt: 'Image of Company',
  });

  fixMisImg(companyImg);

  let companyNameText;
  if (compProfile.industry)
    companyNameText = `${compProfile.companyName} (${compProfile.industry})`;
  else companyNameText = `${compProfile.companyName}`;

  const companyNameIndustry = creatElement('h1', {
    className: 'company-name-industry',
    innerText: companyNameText,
  });

  let currency;
  if (compProfile.currency == 'USD') currency = '$';

  else currency = compProfile.currency;

  const companyPrice = creatElement('p', {
    className: 'company-price', innerText: `Stock Price: ${currency}${compProfile.price} `,
  });

  let percentage = getPercenInfo(compProfile.changesPercentage);

  const companyPercentage = creatElement('span', {
    className: `company-percentage ${percentage.Css}`,
    innerText: `(${percentage.Sign}${percentage.text})`,
  });

  const companyDescription = creatElement('p', {
    className: 'company-description',
    innerText: compProfile.description,
  });

  companyPrice.append(companyPercentage);
  infoContainer.append(companyNameIndustry, companyPrice);
  titleContainer.append(infoContainer, companyImg);
  profileContainer.append(titleContainer, companyDescription);
}