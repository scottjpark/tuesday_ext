const platform = window.location.hostname;

const platformKey = {
    'twitter.com': 'twitter',
    'x.com': 'twitter',
};

const serviceKey = {
    twitter: twitterService, // eslint-disable-line no-undef
};

if (Object.keys(platformKey).includes(platform)) {
    serviceKey[platformKey[platform]]();
}
