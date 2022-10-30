let lastSearch = '';

class Search {
  constructor(containerDom, resultsSearch) {

    this.container = containerDom;
    this.resultsSearch = resultsSearch;
    this.generate();
  }


  async getData(stockSymbol) {
    const searchUrl = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${stockSymbol}&limit=10&exchange=NASDAQ`;
    try {
      const data = await getJson(searchUrl);

      if (!data || !Array.isArray(data) || !data.length) {
        return console.warn("Not Found Result - Data Array");
      }

      lastSearch = stockSymbol;
      return data;

    } catch {
      console.error('It was a problem');
    }
  }

  refillFeeder(isLoading) {
    const searchButton = this.searchButton;

    if (isLoading) {
      searchButton.disabled = true;
      searchButton.innerHTML = '';
      for (let i = 0; i < 5; i++) {
        const loaderDots = document.createElement('span');
        searchButton.append(loaderDots);
      }
    } else {
      searchButton.innerHTML = 'Search';
      searchButton.disabled = false;
    }
  }

  async handlerSearch() {
    this.refillFeeder(true);

    const input = this.inputField.value;

    this.resultsSearch.clearAll();

    const data = await this.getData(input);

    if (data) await this.resultsSearch.addAllRes(data);

    else this.resultsSearch.addNothingFound();
    this.refillFeeder(false);
  }

  userEnterSearch(event) {
    if (event.key === 'Enter') {
      this.handlerSearch();
    }
  }



  generate() {
    this.searchButton = creatElement('button', {
      className: 'searchBtn loader-jump',
      innerText: 'Search',
    });
    this.inputField = creatElement('input', {
      className: 'input-field',
      placeholder: 'Search for company stock symbol',
    });

    this.container.append(this.inputField, this.searchButton);
    this.searchButton.addEventListener('click', e => this.handlerSearch(e));
    this.inputField.addEventListener('keydown', e => this.userEnterSearch(e));
  }
};





class ResultsSearch {
  constructor(containerDom) {
    this.container = containerDom;
    this.generate();
  }

  clearAll() {
    const removeItems = [...this.resultsList.children];
    removeItems.forEach(li => li.remove());
  }

  generate() {
    this.resultsList = creatElement('div', { className: 'results-list' });
    this.container.append(this.resultsList);
  }

  async addAllRes(data) {
    let promAllLines = data.map(this.createResultLine);
    const createdLines = await Promise.all(promAllLines);
    this.resultsList.append(...createdLines);
  }


  async createResultLine(resultObj) {
    const itemContainer = creatElement('div', {
      className: 'result-item-container',
    });

    const profile = await getProfilOfComp(resultObj.symbol);
    const image = creatElement('img', {
      className: 'search-result-img',
      src: profile.image,
    });

    fixMisImg(image);

    let fullLinkText = `${resultObj.name} (${resultObj.symbol})`;
    let res = splitSearch(fullLinkText, lastSearch);
    let linkText = '';

    for (const found of res.hits) {
      const before = found.before;
      const inside = found.inside;
      linkText += before + `<span class='found-Research'>` + inside + `</span>`;
    }

    linkText += res.after;
    const link = creatElement('a', {
      className: 'search-result-text',
      href: `./company.html?symbol=${resultObj.symbol}`,
      target: '_blank',
      innerHTML: linkText,
    });

    let percentage = getPercenInfo(profile.changesPercentage);
    const stockChange = creatElement('span', {
      className: `company-percentage ${percentage.Css}`,
      innerText: `(${percentage.Sign}${percentage.text})`,
    });

    itemContainer.append(image, link, stockChange);
    return itemContainer;
  }
}
