const addStatusBox = (article, status) => {
    const existingStatus = article.parentElement.querySelectorAll(
        '.curation-main-status',
    );
    if (existingStatus.length > 0) return;

    const mainStatusWrapper = document.createElement('div');
    mainStatusWrapper.className = 'curation-main-status';
    mainStatusWrapper.style.backgroundColor = twtbgColor; // eslint-disable-line no-undef
    mainStatusWrapper.style.borderColor = borderColor; // eslint-disable-line no-undef
    article.parentElement.appendChild(mainStatusWrapper);

    const statusImg = document.createElement('img');
    statusImg.className = 'curation-status-img';
    mainStatusWrapper.appendChild(statusImg);
    statusImg.src = status ? successIcon : failIcon; // eslint-disable-line no-undef
};

const addInfoBox = (article, articleImagesFiltered) => {
    // eslint-disable-line no-unused-vars
    const existingBox = article.parentElement.querySelectorAll(
        '.curation-main-wrapper',
    );
    if (existingBox.length > 0) {
        article.parentElement.removeChild(existingBox[0]);
        return;
    }

    // Format data and tags
    const userNameLinks = article
        .querySelectorAll('div[data-testid="User-Name"]')[0]
        .querySelectorAll('a[role="link"]');
    const artist = userNameLinks[1].innerText;
    const displayName = userNameLinks[0].innerText;
    const textBody = article.innerText;
    const hashTags = textBody.match(/#[\p{L}\d_]+/gu) || [];

    let tweetURL;
    // Handle weird edge case for tweet link location
    const links = article.querySelectorAll('a');
    links.forEach((link) => {
        if (window.location.toString().match(link.href)) {
            tweetURL = window.location.toString();
        }
    });
    if (typeof tweetURL !== 'string' && userNameLinks.length > 1) {
        tweetURL = userNameLinks[2].href;
    }

    // THE BOX
    const mainOptionsWrapper = document.createElement('form');
    mainOptionsWrapper.className = 'curation-main-wrapper';
    mainOptionsWrapper.style.backgroundColor = twtbgColor; // eslint-disable-line no-undef
    mainOptionsWrapper.style.borderColor = borderColor; // eslint-disable-line no-undef
    article.parentElement.appendChild(mainOptionsWrapper);

    //   Display Box Status
    const statusDisplayWrapper = document.createElement('div');
    statusDisplayWrapper.className = 'curation-status-wrapper';
    mainOptionsWrapper.appendChild(statusDisplayWrapper);

    // Artist Details
    const detailsWrapper = document.createElement('div');
    detailsWrapper.className = 'curation-details-wrapper';
    mainOptionsWrapper.appendChild(detailsWrapper);

    const artistName = document.createElement('p');
    artistName.innerText = `${displayName}\n${artist}`;
    detailsWrapper.appendChild(artistName);

    // Privacy Details
    const privacyWrapper = document.createElement('div');
    privacyWrapper.className = 'curation-privacy-wrapper';
    mainOptionsWrapper.appendChild(privacyWrapper);

    // NSFW
    const nsfwInputWrapper = document.createElement('div');
    const nsfwLabel = document.createElement('p');
    nsfwLabel.innerText = 'NSFW: ';
    const nsfwInput = document.createElement('input');
    nsfwInput.type = 'checkbox';
    const nsfwCheckStatus = document.querySelector(
        '.curation-global-config-nsfw input',
    ).checked;
    nsfwInput.checked =
        nsfwCheckStatus !== 'undefined' ? nsfwCheckStatus : true;
    nsfwInputWrapper.appendChild(nsfwLabel);
    nsfwInputWrapper.appendChild(nsfwInput);
    privacyWrapper.appendChild(nsfwInputWrapper);

    // Privacy Check
    const privateImageWrapper = document.createElement('div');
    const privateImageLabel = document.createElement('p');
    privateImageLabel.innerText = 'Private: ';
    const privateImage = document.createElement('input');
    privateImage.type = 'checkbox';
    const privacyCheckStatus = document.querySelector(
        '.curation-global-config-private input',
    ).checked;
    privateImage.checked =
        privacyCheckStatus !== 'undefined' ? privacyCheckStatus : true;
    privateImageWrapper.appendChild(privateImageLabel);
    privateImageWrapper.appendChild(privateImage);
    privacyWrapper.appendChild(privateImageWrapper);

    // Tag Wrapper
    const tagsWrapper = document.createElement('div');
    tagsWrapper.className = 'curation-tag-wrapper';
    mainOptionsWrapper.appendChild(tagsWrapper);

    // Tag Display
    const tagDisplayWrapper = document.createElement('div');
    tagDisplayWrapper.className = 'curation-tag-list-wrapper';
    tagsWrapper.appendChild(tagDisplayWrapper);
    const tagLabel = document.createElement('p');
    tagLabel.innerText = 'Tags: ';
    tagDisplayWrapper.appendChild(tagLabel);
    const tagList = document.createElement('div');
    tagList.className = 'curation-tag-list';
    tagDisplayWrapper.appendChild(tagList);

    for (let i = 0; i < hashTags.length; i += 1) {
        const tag = document.createElement('h5');
        tag.innerText = hashTags[i];
        tag.className = 'curation-tags';
        tagList.appendChild(tag);
    }

    // Tag Input
    const tagInputBox = document.createElement('input');
    tagInputBox.type = 'text';
    tagInputBox.className = 'curation-tag-input';
    tagInputBox.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ',' || e.key === 'Tab') {
            e.preventDefault();
            const tag = document.createElement('h5');
            tag.innerText = e.target.value;
            tag.className = 'curation-tags';
            tagList.appendChild(tag);
            hashTags.push(e.target.value);
            tagInputBox.value = '';
        }
    });
    tagsWrapper.appendChild(tagInputBox);

    // Prepare Data and Send
    const imgURLs = [];
    for (let i = 0; i < articleImagesFiltered.length; i += 1) {
        const { currentSrc } = articleImagesFiltered[i];
        currentSrc.replace('small', 'large');
        imgURLs.push(currentSrc);
    }

    const sendToCurator = (e) => {
        e.preventDefault();
        const data = {
            urls: imgURLs,
            tags: hashTags,
            name: artist.replace('@', ''),
            displayName,
            tweetURL,
            nsfw: nsfwInput.checked,
            private: privateImage.checked,
        };
        // Remove the button and replace with loading bar to prevent button spam
        const clickedButton = mainOptionsWrapper.querySelector(
            '.curation-sendbutton',
        );
        clickedButton.remove();
        const sendImg = chrome.runtime.getURL('resources/loader.webp'); // eslint-disable-line
        const loader = document.createElement('img');
        loader.src = sendImg;
        loader.style.width = '20px';
        loader.style.marginTop = '5px';
        mainOptionsWrapper.appendChild(loader);

        const accessToken = localStorage.getItem('curation_access');
        const url =
            'https://tuesday-production.up.railway.app/api/curation/save_twitter/';
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
                mainOptionsWrapper.remove();
                addStatusBox(article, true, returnData);
            })
            .catch((error) => {
                mainOptionsWrapper.remove();
                addStatusBox(article, false, error);
            });
    };

    // Action Wrapper
    const actionWrapper = document.createElement('div');
    actionWrapper.className = 'curation-action-wrapper';
    mainOptionsWrapper.appendChild(actionWrapper);

    // Save Button
    const sendButton = document.createElement('button');
    sendButton.type = 'submit';
    sendButton.className = 'curation-sendbutton';
    sendButton.innerText = 'Save';
    sendButton.onclick = sendToCurator;
    actionWrapper.appendChild(sendButton);
};

/* eslint-disable */
const addCopyButton = (article) => { // eslint-disable-line no-unused-vars
    // Get TweetURL
    const userNameLinks = article.querySelectorAll('div[data-testid="User-Name"]')[0].querySelectorAll('a[role="link"]');
    let tweetURL;
    // Handle weird edge case for tweet link location
    const links = article.querySelectorAll('a');
    links.forEach((link) => {
        if (window.location.toString().match(link.href)) {
            tweetURL = window.location.toString();
        }
    });
    if (userNameLinks.length > 2) {
        if (typeof (tweetURL) !== 'string') {
            tweetURL = userNameLinks[2].href;
        }

        // URL Copy Button
        const copyButton = document.createElement('img');
        copyButton.className = 'curation-copyicon';
        copyButton.src = copyIcon; // eslint-disable-line no-undef
        const newTweetURL = tweetURL.replace(/(?:x\.com|twitter\.com)/g, 'vxtwitter.com');
        copyButton.onclick = (e) => {
            e.preventDefault();
            copyButton.style.opacity = '0.3';
            navigator.clipboard.writeText(newTweetURL);
        };

        // ParentElement
        const shareButtonParent = article.querySelector('button[aria-label="Share post"]').parentElement.parentElement.parentElement;
        if (shareButtonParent.querySelectorAll('.curation-copyicon').length === 0) shareButtonParent.appendChild(copyButton);
    }
};

// eslint-disable-next-line no-unused-vars
const addConfigButton = () => {
    // Check all loaded tweets
    const articles = document.querySelectorAll('article');
    articles.forEach((article) => {
        addCopyButton(article); // eslint-disable-line no-undef
        const articleImages = article.querySelectorAll('img');
        if (
            articleImages.length > 1 &&
            article.querySelectorAll('.tuesday_curate_button').length === 0
        ) {
            // Check to see if the tweet contains an image, other than the avatar
            // Advertisement images are not stored in https://pbs.twimg.com/media/
            const articleImagesFiltered = [];
            articleImages.forEach((articleImage) => {
                if (
                    articleImage.alt === 'Image' &&
                    articleImage.src.includes('https://pbs.twimg.com/media/')
                ) {
                    articleImagesFiltered.push(articleImage);
                }
            });

            const updatePopup = (e) => {
                e.preventDefault();
                const existingFormBoxes = article.querySelectorAll(
                    'form.tuesday-config',
                );
                if (!(existingFormBoxes.length > 0)) {
                    addInfoBox(article, articleImagesFiltered); // eslint-disable-line no-undef
                }
            };
            if (articleImagesFiltered.length > 0) {
                // Place config button
                const sendImg = chrome.runtime.getURL('resources/share.png'); // eslint-disable-line
                const articleDots = article.querySelector(
                    'button[data-testid="caret"]',
                );
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
