const env = require('dotenv').config();

const queryString = require('queryString');


const params = queryString.stringify({
    client_id: process.env.GITHUB_CLIENT_ID,
    redirect_uri: 'http://127.0.0.1/auth/github',
    scope: ['read:user', 'user:email'].join(' '), // space seperated string
    allow_signup: true,
});


const githubLoginUrl = `https://github.com/login/oauth/authorize?${params}`;