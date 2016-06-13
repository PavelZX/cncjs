import endsWith from 'lodash/endsWith';
import mapKeys from 'lodash/mapKeys';
import sha1 from 'sha1';
import log from '../lib/log';

const root = window.root;

console.assert(typeof root.app.config === 'object', 'root.app.config is not an object');

const settings = {
    version: root.app.config.version,
    webroot: root.app.config.webroot,
    name: 'cnc',
    log: {
        level: 'warn', // trace, debug, info, warn, error
        logger: 'console', // console
        prefix: ''
    },
    i18next: {
        lowerCaseLng: true,

        // logs out more info (console)
        debug: false,

        // language to lookup key if not found on set language
        fallbackLng: 'en',

        // string or array of namespaces
        ns: [
            'locale', // locale: language, timezone, ...
            'resource' // default
        ],
        // default namespace used if not passed to translation function
        defaultNS: 'resource',

        whitelist: [
            'en', // default language
            'de',
            'es',
            'fr',
            'it',
            'ja',
            'zh-cn',
            'zh-tw'
        ],

        // array of languages to preload
        preload: [],

        // language codes to lookup, given set language is 'en-US':
        // 'all' --> ['en-US', 'en', 'dev']
        // 'currentOnly' --> 'en-US'
        // 'languageOnly' --> 'en'
        load: 'currentOnly',

        // char to separate keys
        keySeparator: '.',

        // char to split namespace from key
        nsSeparator: ':',

        interpolation: {
            prefix: '{{',
            suffix: '}}'
        },

        // options for language detection
        // https://github.com/i18next/i18next-browser-languageDetector
        detection: {
            // order and from where user language should be detected
            order: ['querystring', 'cookie', 'localStorage'],

            // keys or params to lookup language from
            lookupQuerystring: 'lang',
            lookupCookie: 'lang',
            lookupLocalStorage: 'lang',

            // cache user language on
            caches: ['localStorage', 'cookie']
        },
        // options for backend
        // https://github.com/i18next/i18next-xhr-backend
        backend: {
            // path where resources get loaded from
            loadPath: root.app.config.webroot + 'i18n/{{lng}}/{{ns}}.json',

            // path to post missing resources
            addPath: 'api/i18n/sendMissing/{{lng}}/{{ns}}',

            // your backend server supports multiloading
            // /locales/resources.json?lng=de+en&ns=ns1+ns2
            allowMultiLoading: false,

            parse: function(data, url) {
                if (endsWith(url, '/resource.json')) {
                    const source = JSON.parse(data);
                    const target = mapKeys(source, (value, key) => sha1(key));
                    data = JSON.stringify(target, null, 2);
                }

                log.trace(`Loading resource: url="${url}"`);

                return data;
            },

            // allow cross domain requests
            crossDomain: false
        }
    }
};

export default settings;
