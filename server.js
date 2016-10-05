const express = require('express');
const {sync: globSync} = require('glob');
const {readFileSync} = require('fs');
const path = require('path');
const cors = require('cors');
const R = require('ramda');
const fs = require('fs');

const loadFiles = R.curry(function (pattern) {
    return globSync(pattern)
        .map(filename => ({
            filename,
            content: fs.readFileSync(filename, 'utf8')
        }));
});

// {id, defaultMessage} -> { id: defaultMessage }
const transformTranslation = (transformed, current) => {
    return R.merge({ [current.id]: current.defaultMessage })(transformed)
};

const loadTranslations = R.curry(pattern => {
    return loadFiles(pattern).map(file => JSON.parse(file.content)).reduce((collection, translation) => {
        const transformedTranslation = translation.reduce(transformTranslation, {});
        return R.merge(transformedTranslation)(collection);
    }, {});
});

const app = express();

app.use(cors());

app.get('/', (req, res) => {
    let locale = req.query.locale;
    let messages = loadTranslations(`./src/**/${locale}.json`);
    if (!messages) {
        return res.status(404).send('Locale is not supported.');
    }

    res.send({ locale, messages });
});

app.listen(8080, () => {
    console.log('Translations server listening at: http://localhost:8080');
});
