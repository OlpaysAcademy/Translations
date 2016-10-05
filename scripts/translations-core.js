const fs = require('fs');
const R = require('ramda');
const { sync: globSync } = require('glob');

// file pattern -> [{filename, filetext}]
const loadFiles = R.curry(function (pattern) {
    return globSync(pattern)
        .map(filename => ({
            filename,
            content: fs.readFileSync(filename, 'utf8')
        }));
});

const loadTranslations = R.curry(pattern => {
    return loadFiles(pattern).map(file => JSON.parse(file.content));
});

// [{filename, filetext}] -> {filename: messages, filename2: messages2, ...}
const extractMessages = R.curry(files => {
    return files.reduce((collection, file) => {
        const { metadata } = require('babel-core').transform(file.content, {
            presets: ['react'],
            plugins: ['react-intl']
        });
        if (!metadata['react-intl'].messages.length) {
            return collection;
        }
        return R.merge({
            [file.filename]: metadata['react-intl'].messages
        })(collection);
    }, {});
});

// {} => {messages: {filename: [messages]}}
const loadMessages = R.pipe(
    loadFiles,
    extractMessages
);

// TODO: Ensure every translation file is an array that contains {id, defaultMessage}
const extractIds = function (translation) {
    return translation.map(t => t.id);
}

const concatIds = (collection, ids) => collection.concat(ids);
const collectDuplicates = (collection, element, index, array) => {
    const appearances = array.filter(elem => elem === element).length;
    if (appearances > 1) {
        return R.merge({ [element]: appearances })(collection);
    }
    return collection;
};

const detectDuplicatedKeys = R.curry(({ translations }) => {
    return translations.map(extractIds).reduce(concatIds, []).reduce(collectDuplicates, {});
});

const appendUntranslated = R.curry((translations, messageIdsMap) => {
    const translationIds = R.flatten(translations).map(t => t.id);
    const isUntranslated = messageId => {
        return !translationIds.includes(messageId);
    };
    return R.map(messageIds => {
        return messageIds.filter(isUntranslated)
    })(messageIdsMap);
});

const pruneFilesWithoutUntranslatedMessages = R.curry(messageIdsMap => {
    return R.filter(messages => messages.length)(messageIdsMap)
});

const detectUntranslatedKeys = R.curry(({ translations, messages }) => {
    return R.pipe(
        R.map(extractIds),
        appendUntranslated(translations),
        pruneFilesWithoutUntranslatedMessages
    )(messages);
});

const checkTranslations = ({ translationsPattern, componentsPattern }) => R.pipe(
    R.merge({ translations: loadTranslations(translationsPattern) }),
    R.merge({ messages: loadMessages(componentsPattern) }),
    data => R.merge({ duplicates: detectDuplicatedKeys(data) })(data),
    data => R.merge({ untranslated: detectUntranslatedKeys(data) })(data)
)({});

module.exports = checkTranslations;
