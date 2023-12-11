const successIcon = chrome.runtime.getURL('images/success.png'); // eslint-disable-line
const failIcon = chrome.runtime.getURL('images/fail.webp'); // eslint-disable-line
const copyIcon = chrome.runtime.getURL('images/copy.png'); // eslint-disable-line

const bgColor = document.body.style.backgroundColor;
let borderColor;
if (bgColor === 'rgb(255, 255, 255)') {
  borderColor = 'rgba(239, 243, 244, 1.00)';
} else if (bgColor === 'rgb(0, 0, 0)') {
  borderColor = 'rgb(47, 51, 54)';
} else {
  borderColor = 'rgb(56, 68, 77)'; // eslint-disable-line no-unused-vars
}

let globalConfig = localStorage.getItem('curation_config');

if (!globalConfig) {
  globalConfig = { nsfw: true, private: true };
  localStorage.setItem('curation_config', globalConfig);
}
