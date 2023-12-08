// const addInfoBox = (article, articleImagesFiltered) => {

//   // Organize the data to be sent
//   const imgURLs = [];
//   for (let i = 0; i < articleImagesFiltered.length; i += 1) {
//     const { currentSrc } = articleImagesFiltered[i];
//     currentSrc.replace('small', 'large');
//     imgURLs.push(currentSrc);
//   }

//   const data = {
//     urls: imgURLs,
//     tags: hashTags,
//     name: artist.replace('@', ''),
//     displayName,
//     tweetURL,
//   };

//   const sendToCurator = () => {
//     // Remove the button and replace with loading bar to prevent button spam
//     const clickedButton = formBox.querySelector('.curation-button');
//     clickedButton.remove();
//     const sendImg = chrome.runtime.getURL('images/loader.webp'); // eslint-disable-line
//     const loader = document.createElement('img');
//     loader.src = sendImg;
//     loader.style.width = '20px';
//     formBox.appendChild(loader);

//     const accessToken = localStorage.getItem('curation_access');
//     const url = 'https://tuesday-production.up.railway.app/api/curation/save_twitter/';
//     fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${accessToken}`,
//       },
//       body: JSON.stringify(data),
//     })
//       .then((response) => response.json())
//       .then((returnData) => {
//         formBox.remove();
//         article.parentNode.appendChild(statusBox);
//         statusBox.style.color = 'rgb(50, 205, 50)';
//         statusBox.innerText = returnData;
//       })
//       .catch((error) => {
//         formBox.remove();
//         article.parentNode.appendChild(statusBox);
//         statusBox.style.color = 'rgb(255, 0, 0)';
//         statusBox.innerText = `Something went wrong: ${error}`;
//       });
//   };


//   sendButton.style.fontSize = '0.8em';
//   sendButton.onclick = sendToCurator;
//   formBox.appendChild(sendButton);
// };

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
  timer = setTimeout(() => { addConfigButton(); }, 500);
}, false);
