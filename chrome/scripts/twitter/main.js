// eslint-disable-next-line no-unused-vars
const twitterService = () => {
    // Set up auth login element
    const intervalId = setInterval(async () => {
        const tokenStatus = await checkAccessToken() // eslint-disable-line no-undef
            .then((res) => res)
            .catch(() => false);
        if (
            document.readyState === 'complete' &&
            typeof tokenStatus === 'boolean'
        ) {
            clearInterval(intervalId);
            setStatusFields(tokenStatus); // eslint-disable-line no-undef
            if (tokenStatus) {
                setGlobalConfigs(); // eslint-disable-line no-undef
            } else {
                const loginElementParent =
                    document.querySelector('nav').parentElement;
                addLoginFields(loginElementParent, '206px'); // eslint-disable-line no-undef
            }
        }
    }, 1000);

    // Adds function button as you scroll
    let timer = null;
    document.addEventListener(
        'scroll',
        () => {
            if (timer !== null) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                addConfigButton(); // eslint-disable-line no-undef
            }, 500);
        },
        false,
    );
};
