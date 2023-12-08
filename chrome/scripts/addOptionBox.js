const addInfoBox = (article, articleImagesFiltered) => {
    // Format data and tags
    const userNameField = article.querySelectorAll('div[data-testid="User-Name"]')[0];
    const artist = userNameField.querySelectorAll('span')[3].innerText;
    const displayName = userNameField.querySelectorAll('span')[0].innerText;
    const textBody = article.innerText;
    const hashTags = textBody.match(/#[\p{L}\d_]+/gu) || [];
    const tweetURL = article.querySelectorAll('a')[3].href;
    const bgColor = document.body.style.backgroundColor;
    let fontColor;
    if (bgColor === 'rgb(255, 255, 255)') {
        fontColor = 'black';
    } else {
        fontColor = 'white';
    }

    // THE BOX
    const mainOptionsWrapper = document.createElement('form')
    mainOptionsWrapper.className = 'curation-main-wrapper'
    mainOptionsWrapper.style.backgroundColor = bgColor
    article.parentElement.appendChild(mainOptionsWrapper)

    // Artist Details
    const detailsWrapper = document.createElement('div')
    detailsWrapper.className = 'curation-details-wrapper'
    mainOptionsWrapper.appendChild(detailsWrapper)
    
    const artistName = document.createElement('p')
    artistName.innerText = displayName + artist
    detailsWrapper.appendChild(artistName)

    // Privacy Details
    const privacyWrapper = document.createElement('div')
    privacyWrapper.className = 'curation-privacy-wrapper'
    mainOptionsWrapper.appendChild(privacyWrapper)

    // NSFW 
    const nsfwInputWrapper = document.createElement('div')
    const nsfwLabel = document.createElement('p')
    nsfwLabel.innerText = 'NSFW: '
    const nsfwInput = document.createElement('input')
    nsfwInput.type = 'checkbox'
    nsfwInput.onclick = () => {
        console.log(nsfwInput.checked)
    }
    nsfwInputWrapper.appendChild(nsfwLabel)
    nsfwInputWrapper.appendChild(nsfwInput)
    privacyWrapper.appendChild(nsfwInputWrapper)
    
    // Privacy Check
    const privateImageWrapper = document.createElement('div')
    const privateImageLabel = document.createElement('p')
    privateImageLabel.innerText = 'Private: '
    const privateImage = document.createElement('input')
    privateImage.type = 'checkbox'
    privateImage.onclick = () => {
        console.log(privateImage.checked)
    }
    privateImageWrapper.appendChild(privateImageLabel)
    privateImageWrapper.appendChild(privateImage)
    privacyWrapper.appendChild(privateImageWrapper)

    // Tag Wrapper
    const tagsWrapper = document.createElement('div')
    tagsWrapper.className = 'curation-tag-wrapper'
    mainOptionsWrapper.appendChild(tagsWrapper)

    // Tag Display
    const tagDisplayWrapper = document.createElement('div')
    tagDisplayWrapper.className = 'curation-tag-list-wrapper'
    tagsWrapper.appendChild(tagDisplayWrapper)
    const tagLabel = document.createElement('p')
    tagLabel.innerText = 'Tags: '
    tagDisplayWrapper.appendChild(tagLabel)
    const tagList = document.createElement('div')
    tagList.className = 'curation-tag-list'
    tagDisplayWrapper.appendChild(tagList)

    for (let i = 0; i < hashTags.length; i += 1) {
        const tag = document.createElement('h5');
        tag.innerText = hashTags[i];
        tag.className = 'curation-tags'
        tagList.appendChild(tag);
    }

    // Tag Input
    const tagInputBox = document.createElement('input');
    tagInputBox.type = 'text'
    tagInputBox.className = 'curation-tag-input'
    tagInputBox.addEventListener('keypress', (e) => {
    if (e.code === 'Enter' || e.code === 'Comma') {
          e.preventDefault();
          const tag = document.createElement('h5');
          tag.innerText = e.target.value;
          tag.className = 'curation-tags'
          tagList.appendChild(tag);
          hashTags.push(e.target.value);
          tagInputBox.value = '';
        }
    });
    tagsWrapper.appendChild(tagInputBox)

    // Save Button
    const sendButton = document.createElement('div')
    sendButton.className = 'curation-sendbutton'
    sendButton.innerText = 'Save'
    mainOptionsWrapper.appendChild(sendButton)
}