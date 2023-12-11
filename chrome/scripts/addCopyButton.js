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
    const shareButtonParent = article.querySelector('div[aria-label="Share post"]').parentElement.parentElement.parentElement;
    if (shareButtonParent.querySelectorAll('.curation-copyicon').length === 0) shareButtonParent.appendChild(copyButton);
  }
};
