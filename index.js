const express = require('express');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');

const getContrastTextColor = require('./contrast.js');

if(!fs.existsSync('./serviceAccountKey.json')) throw new Error('Service account key not found. Please create one at serviceAccountKey.json');

const { project_id } = require('./serviceAccountKey.json');

const styling = fs.readFileSync('./style.css', 'utf-8');

const { info, error, success, warn, APIError, special, APIResponseError } = require('./logs');

const PORT = process.env.PORT || 80;

const advancedAdvancedLogging = process.env.ADVANCED_ADVANCED_LOGGING?.toLowerCase() == 'true' || process.argv.includes('--aal');

const advancedLogging =  advancedAdvancedLogging || process.env.ADVANCED_LOGGING?.toLowerCase() == 'true' || process.argv.includes('--al');

module.exports.ADVANCED_LOGGING = advancedLogging;
module.exports.ADVANCED_ADVANCED_LOGGING = advancedAdvancedLogging;

require('dotenv').config().error ? warn('Environment file not found. Please create one at .env') : advancedAdvancedLogging ? info('Environment file found.') : null;

if(!fs.existsSync('./internal/allowlist.json')) throw new Error('Internal allowlist not found. Please create one at internal/allowlist.json');

const internalAllowList = require('./internal/allowlist.json');

const routeLimiter = rateLimit({ windowMs: 60 * 1000, max: 20 });

const apiLimiter = rateLimit({ windowMs: 60 * 1000, max: 10 });

const app = express();

console.warn = warn;
console.error = error;
console.info = info;
console.success = success;

app.use(express.json());

app.use(require('cookie-parser')());

const internalOnly = (req, res, next) => {
if(internalAllowList.includes(req.hostname)) next();
else APIResponseError({ msg: 'Forbidden', status: 403, res })
}


let cachedKeys = null;
let keysFetchTime = null;

async function getCachedFirebasePublicKeys() {
    const url = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';

    const cacheDuration = 24 * 60 * 60 * 1000;
    if (cachedKeys && keysFetchTime && Date.now() - keysFetchTime < cacheDuration) {
        return cachedKeys;
    }

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch Firebase public keys');
    }

    if(advancedAdvancedLogging) info('Fetched Firebase public keys');

    cachedKeys = await response.json();
    keysFetchTime = Date.now();
    return cachedKeys;
}

app.use(async (req, res, next) => {
    let fullPath = req.path + (req.query ? '?' + new URLSearchParams(req.query).toString() : '');
    if(fullPath.endsWith('?')) fullPath = fullPath.slice(0, -1);
    if(advancedAdvancedLogging) info(`Request to ${fullPath} from ${req.hostname}`);
    if (req.cookies.token) {
        if (req.path.split('/').join('') === 'resignin' || req.path.includes('.')) {
            return next();
        }
        try {
            const decodedHeader = jwt.decode(req.cookies.token, { complete: true });
            if (!decodedHeader || !decodedHeader.header.kid) {
                throw new Error('Invalid token header');
            }

            const publicKeys = await getCachedFirebasePublicKeys();
            const publicKey = publicKeys[decodedHeader.header.kid];
            if (!publicKey) {
                throw new Error('Public key for the token not found');
            }

            jwt.verify(req.cookies.token, publicKey, {
                algorithms: ['RS256'], 
                audience: project_id,
                issuer: `https://securetoken.google.com/` + project_id,
            }, (err, decoded) => {
                if (err) {
                if(advancedLogging) error(err);
                return res.redirect('/resignin?redirect=' + fullPath);
                }
                next();
            });
        } catch (error) {
            if(advancedLogging) error(error);
            return res.redirect('/resignin?redirect=' + fullPath);
        }
    } else {
        if(advancedAdvancedLogging) info('No token found, continuing without authentication.');
        next();
    }
});


app.use(express.urlencoded({ extended: true }));

app.use(express.static('static'));


fs.readdirSync('./routes').filter(e => e.endsWith('.js') || e.endsWith('.ts')).forEach(file => {
    const routePath = path.join(__dirname, 'routes', file);
    const route = require(routePath);
    if (typeof route === 'function') {
        app.use(routeLimiter, route);
        if(advancedLogging) success(`Route ${file} loaded.`);
    } else {
        error(`Route file ${file} does not export a valid function.`);
    }
});


fs.readdirSync('./internal').filter(e => e.endsWith('.js') || e.endsWith('.ts')).forEach(file => {
    const routePath = path.join(__dirname, 'internal', file);
    const route = require(routePath);
    if (typeof route === 'function') {
        app.use(internalOnly, route);
        if(advancedLogging) success(`Internal route ${file} loaded.`);
    } else {
        error(`Internal route file ${file} does not export a valid function.`);
    }
});

fs.readdirSync('./api').filter(e => e.endsWith('.js') || e.endsWith('.ts')).forEach(file => {
    const routePath = path.join(__dirname, 'api', file);
    const route = require(routePath);
    if (typeof route === 'function') {
        app.use('/api', (req, res, next) => { next() }, apiLimiter, route);   
        if(advancedLogging) success(`API route ${file} loaded.`);
     } else {
       error(`API route file ${file} does not export a valid function.`);
    }
});

app.get('/firebase.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript').sendFile(path.join(__dirname, 'firebase.js'));
})    

app.get('/style.css', (req, res) => {
    let customStyling = styling;
    if(req.cookies.background) customStyling = customStyling.split('BACKGROUND_COLOR').join(req.cookies.background);
    else customStyling = customStyling.split('BACKGROUND_COLOR').join('rgb(45, 45, 45)');
    if(req.cookies.text) customStyling = customStyling.split('TEXT_COLOR').join(req.cookies.text);
    else customStyling = customStyling.split('TEXT_COLOR').join(getContrastTextColor(req.cookies.background || [45, 45, 45]));
    res.setHeader('Content-Type', 'text/css').send(customStyling);
})    

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '404.html'));
})

app.listen(PORT, () => {
    special(`Server started on port`, PORT);
})