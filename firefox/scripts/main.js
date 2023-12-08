const addConfigButton = () => {
  // Check all loaded tweets
  const articles = document.querySelectorAll('article');
  articles.forEach((article) => {
    const articleImages = article.querySelectorAll('img');
    if (articleImages.length > 1 && article.querySelectorAll('.tuesday_curate_button').length === 0) {
      // Check to see if the tweet contains an image, other than the avatar
      // Advertisement images are not stored in https://pbs.twimg.com/media/
      const articleImagesFiltered = [];
      articleImages.forEach((articleImage) => {
        if (articleImage.alt === 'Image' && articleImage.src.includes('https://pbs.twimg.com/media/')) {
          articleImagesFiltered.push(articleImage);
        }
      });

      const updatePopup = (e) => {
        e.preventDefault();
        const existingFormBoxes = article.querySelectorAll('form.tuesday-config');
        if (!(existingFormBoxes.length > 0)) {
          addInfoBox(article, articleImagesFiltered); // eslint-disable-line no-undef
        }
      };

      if (articleImagesFiltered.length > 0) {
        // Place config button
        const sendImg = chrome.runtime.getURL('images/share.png'); // eslint-disable-line
        const articleDots = article.querySelector('div[data-testid="caret"]');
        const configButton = document.createElement('img');
        configButton.style.height = '2em';
        configButton.style.margin = '0 0 0 0.8em';
        configButton.style.borderRadius = '50%';
        configButton.src = sendImg;
        configButton.className = 'tuesday_curate_button';
        configButton.style.border = `1px solid ${borderColor}`; // eslint-disable-line no-undef
        configButton.onclick = updatePopup;
        articleDots.parentElement.appendChild(configButton);
      }
    }
  });
};

// Adds button as you scroll
let timer = null;
document.addEventListener('scroll', () => {
  if (timer !== null) {
    clearTimeout(timer);
  }
  timer = setTimeout(() => { addConfigButton(); }, 500);
}, false);
