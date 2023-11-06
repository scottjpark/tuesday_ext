const addInfoBox = (article, articleImagesFiltered) => {
  // Format data and tags
  const userNameField = article.querySelectorAll('div[data-testid="User-Name"]')[0];
  const artist = userNameField.querySelectorAll('span')[3].innerText;
  const displayName = userNameField.querySelectorAll('span')[0].innerText;
  const textBody = article.innerText;
  const hashTags = textBody.match(/#(\w+)/g) || [];
  const tweetURL = article.querySelectorAll('a')[3].href;

  // Format and append box
  const bgColor = document.body.style.backgroundColor;
  let fontColor;
  if (bgColor === 'rgb(255, 255, 255)') {
    fontColor = 'black';
  } else {
    fontColor = 'white';
  }
  const fontFamily = 'TwitterChirp, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

  const formBox = document.createElement('form');
  formBox.className = 'tuesday-config';
  formBox.style.color = fontColor;
  formBox.style.fontFamily = fontFamily;
  formBox.style.display = 'flex';
  formBox.style.flexDirection = 'column';
  formBox.style.alignItems = 'flex-start';
  formBox.style.padding = '14px';
  formBox.style.margin = '3px 16px 16px 68px';
  formBox.style.border = '1px solid #5C6E7E';
  formBox.style.borderRadius = '16px';

  article.parentNode.appendChild(formBox);

  const artistName = document.createElement('h5');
  artistName.innerText = `Artist: ${artist}`;
  artistName.style.margin = '0px';
  formBox.appendChild(artistName);

  const tagDiv = document.createElement('div');
  tagDiv.style.display = 'flex';
  formBox.appendChild(tagDiv);

  const tagLine = document.createElement('h5');
  tagLine.style.margin = '10px 0px 10px 0px';
  tagLine.innerText = 'Tags: ';
  tagDiv.appendChild(tagLine);

  const tagList = document.createElement('div');
  tagList.style.display = 'flex';
  tagList.style.justifyContent = 'flex-start';
  tagList.style.alignItems = 'center';
  tagDiv.appendChild(tagList);

  for (let i = 0; i < hashTags.length; i += 1) {
    const tag = document.createElement('h5');
    tag.innerText = hashTags[i];
    tag.style.margin = '0px';
    tag.style.margin = '0px 5px 0px 5px';
    tagList.appendChild(tag);
  }

  const tagInputBox = document.createElement('textarea');
  tagInputBox.style.width = '50%';
  tagInputBox.style.opacity = '0.80';
  tagInputBox.style.margin = '0 0 10px 0';

  tagInputBox.addEventListener('keypress', (e) => {
    if (e.code === 'Enter' || e.code === 'Comma') {
      e.preventDefault();
      const tag = document.createElement('h5');
      tag.innerText = e.target.value;
      tag.style.margin = '0px';
      tag.style.margin = '0px 5px 0px 5px';
      tagList.appendChild(tag);
      hashTags.push(e.target.value);
      tagInputBox.value = '';
    }
  });

  formBox.appendChild(tagInputBox);

  // Organize the data to be sent
  const imgURLs = [];
  for (let i = 0; i < articleImagesFiltered.length; i += 1) {
    const { currentSrc } = articleImagesFiltered[i];
    currentSrc.replace('small', 'large');
    imgURLs.push(currentSrc);
  }

  const data = {
    urls: imgURLs,
    tags: hashTags,
    name: artist.replace('@', ''),
    displayName,
    tweetURL,
  };

  const sendToCurator = () => {
    const accessToken = localStorage.getItem('curation_access');
    const url = 'http://localhost:8000/api/curation/save_twitter/';
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((returnData) => {
        console.log(returnData);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const sendButton = document.createElement('div');
  sendButton.style.cursor = 'pointer';
  sendButton.innerText = 'Send';
  sendButton.onclick = sendToCurator;
  formBox.appendChild(sendButton);
};

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
          addInfoBox(article, articleImagesFiltered);
        }
      };

      if (articleImagesFiltered.length > 0) {
        // Place config button
        const sendImg = chrome.runtime.getURL('images/share.png'); // eslint-disable-line
        const groupElements = article.querySelector('div[role="group"]');
        const configButton = document.createElement('img');
        configButton.style.height = '1.5em';
        configButton.style.padding = '0 0 0 2em';
        configButton.src = sendImg;
        configButton.className = 'tuesday_curate_button';
        configButton.onclick = updatePopup;
        groupElements.appendChild(configButton);
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
  timer = setTimeout(() => { addConfigButton(); }, 200);
}, false);
