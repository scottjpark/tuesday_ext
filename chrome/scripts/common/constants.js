// eslint-disable-next-line no-unused-vars
const TWITTER_FONT_FAMILY =
    'TwitterChirp, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const successIcon = chrome.runtime.getURL('resources/success.png'); // eslint-disable-line
const failIcon = chrome.runtime.getURL('resources/fail.webp'); // eslint-disable-line
const copyIcon = chrome.runtime.getURL('resources/copy.png'); // eslint-disable-line

const twtbgColor = document.body.style.backgroundColor;
let borderColor;
if (twtbgColor === 'rgb(255, 255, 255)') {
    borderColor = 'rgba(239, 243, 244, 1.00)';
} else if (twtbgColor === 'rgb(0, 0, 0)') {
    borderColor = 'rgb(47, 51, 54)';
} else {
    borderColor = 'rgb(56, 68, 77)'; // eslint-disable-line no-unused-vars
}

let globalConfig = localStorage.getItem('curation_config');

if (!globalConfig) {
    globalConfig = { nsfw: true, private: true };
    localStorage.setItem('curation_config', globalConfig);
}
