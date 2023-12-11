const FONTFAMILY = 'TwitterChirp, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

const checkAccessToken = async () => {
  const accessToken = localStorage.getItem('curation_access');
  if (!accessToken) return false;

  const url = 'https://tuesday-production.up.railway.app/api/users/token/verify/';
  const data = {
    token: accessToken,
  };

  const tokenStatus = await $.ajax({ // eslint-disable-line no-undef
    method: 'POST',
    url,
    data,
  }).fail('caught');

  const responseLength = Object.keys(tokenStatus).length;
  if (responseLength === 0) {
    return true;
  }
  return false;
};

const removeLoginFields = () => {
  const loginFields = document.querySelectorAll('form#curation-login');
  if (loginFields.length > 0) {
    loginFields[0].remove();
  }
};

const setStatusFields = (status) => {
  const existingText = document.querySelectorAll('#curation-status');
  if (!(existingText.length > 0)) {
    const statusWrap = document.createElement('div');
    statusWrap.id = 'curation-status';
    statusWrap.style.display = 'flex';
    statusWrap.style.justifyContent = 'center';
    statusWrap.style.width = '233px';

    const statusText = document.createElement('p');
    statusText.style.fontFamily = FONTFAMILY;
    statusText.style.display = 'inline-block';
    statusText.style.margin = '5px 0 5px 0';
    statusText.style.fontSize = '0.8em';
    statusWrap.appendChild(statusText);

    const navBar = document.querySelector('header div div div div');
    navBar.appendChild(statusWrap);
  }

  const statusBox = document.querySelector('#curation-status p');
  if (status) {
    statusBox.style.color = 'rgb(50, 205, 50)';
    statusBox.innerText = 'Curation Ready';
  } else {
    statusBox.style.color = 'rgb(255, 0, 0)';
    statusBox.innerText = 'Verify Login';
  }
};

const setGlobalConfigs = () => {
  const defaultBehaviorWrapper = document.createElement('div');
  defaultBehaviorWrapper.className = 'curation-global-behavior-wrapper';

  const navBar = document.querySelector('header div div div div');
  navBar.appendChild(defaultBehaviorWrapper);

  // NSFW
  const nsfwGlobalInputWrapper = document.createElement('div');
  nsfwGlobalInputWrapper.className = 'curation-global-config-nsfw';

  const nsfwGlobalLabel = document.createElement('p');
  nsfwGlobalLabel.innerText = 'NSFW: ';

  const nsfwGlobalInput = document.createElement('input');
  nsfwGlobalInput.type = 'checkbox';
  nsfwGlobalInput.checked = globalConfig.nsfw; // eslint-disable-line no-undef

  nsfwGlobalInputWrapper.appendChild(nsfwGlobalLabel);
  nsfwGlobalInputWrapper.appendChild(nsfwGlobalInput);
  defaultBehaviorWrapper.appendChild(nsfwGlobalInputWrapper);

  // Private
  const privacyGlobalInputWrapper = document.createElement('div');
  privacyGlobalInputWrapper.className = 'curation-global-config-private';

  const privacyGlobalLabel = document.createElement('p');
  privacyGlobalLabel.innerText = 'Private: ';

  const privacyGlobalInput = document.createElement('input');
  privacyGlobalInput.type = 'checkbox';
  privacyGlobalInput.checked = globalConfig.private; // eslint-disable-line no-undef

  privacyGlobalInputWrapper.appendChild(privacyGlobalLabel);
  privacyGlobalInputWrapper.appendChild(privacyGlobalInput);
  defaultBehaviorWrapper.appendChild(privacyGlobalInputWrapper);
};

const addLoginFields = () => {
  // Data Handling
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const username = e.target[0].value;
    const password = e.target[1].value;

    const userData = {
      username,
      password,
    };

    const url = 'https://tuesday-production.up.railway.app/api/users/token/';

    $.post(url, userData).done((response) => { // eslint-disable-line no-undef
      if (response.access) {
        localStorage.setItem('curation_access', response.access);
        setStatusFields(true);
        removeLoginFields();
      }
    });
  };

  // Format login box
  const loginBox = document.createElement('form');
  loginBox.id = 'curation-login';
  loginBox.style.margin = '10px 0 0 0';
  loginBox.style.padding = '5px';
  loginBox.style.width = '206px';
  loginBox.style.border = '1px solid #5C6E7E';
  loginBox.style.borderRadius = '5px';
  loginBox.style.display = 'flex';
  loginBox.style.flexDirection = 'column';
  loginBox.style.alignItems = 'center';
  loginBox.style.justifyContent = 'flex-start';
  loginBox.style.fontFamily = FONTFAMILY;
  loginBox.onsubmit = handleFormSubmit;

  // Username Field
  const usernameContainer = document.createElement('div');
  usernameContainer.style.width = '100%';
  usernameContainer.style.display = 'flex';
  usernameContainer.style.justifyContent = 'space-between';
  usernameContainer.style.alignItems = 'center';

  const usernameText = document.createElement('p');
  usernameText.style.fontSize = '0.8em';
  usernameText.style.margin = '3px 0px 2px 5px';
  usernameText.style.width = '40%';
  usernameText.innerText = 'Username: ';

  const usernameInput = document.createElement('input');
  usernameInput.id = 'curation-username';
  usernameInput.style.width = '60%';
  usernameInput.style.margin = '2px 5px 2px 15px';

  usernameContainer.appendChild(usernameText);
  usernameContainer.appendChild(usernameInput);

  // Password Field
  const passwordContainer = document.createElement('div');
  passwordContainer.style.width = '100%';
  passwordContainer.style.display = 'flex';
  passwordContainer.style.justifyContent = 'space-between';
  passwordContainer.style.alignItems = 'center';

  const passwordText = document.createElement('p');
  passwordText.style.fontSize = '0.8em';
  passwordText.style.margin = '3px 0px 2px 5px';
  passwordText.style.width = '40%';
  passwordText.innerText = 'Password: ';

  const passwordInput = document.createElement('input');
  passwordInput.type = 'password';
  passwordInput.id = 'curation-password';
  passwordInput.style.width = '60%';
  passwordInput.style.margin = '2px 5px 2px 15px';

  passwordContainer.appendChild(passwordText);
  passwordContainer.appendChild(passwordInput);

  // Submit Button
  const loginSubmitButton = document.createElement('input');
  loginSubmitButton.type = 'submit';
  loginSubmitButton.value = 'Login';
  loginSubmitButton.style.margin = '10px 0 0 0';

  // Assembly
  const navBar = document.querySelector('header div div div div');
  navBar.appendChild(loginBox);
  loginBox.appendChild(usernameContainer);
  loginBox.appendChild(passwordContainer);
  loginBox.appendChild(loginSubmitButton);
};

const intervalId = setInterval(async () => {
  const tokenStatus = await checkAccessToken()
    .then((res) => res)
    .catch(() => false);
  if (document.readyState === 'complete' && typeof tokenStatus === 'boolean') {
    clearInterval(intervalId);
    setStatusFields(tokenStatus);
    if (tokenStatus) {
      setGlobalConfigs();
    } else {
      addLoginFields();
    }
  }
}, 1000);
