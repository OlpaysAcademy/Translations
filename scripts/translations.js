const chalk = require('chalk');
const R = require('ramda');

const checkTranslations = require('./translations-core');

const COMPONENTS_PATTERN = './src/**/*.js';
const TRANSLATIONS_PATTERN = './src/**/*.json';

const translations = checkTranslations({
    componentsPattern: COMPONENTS_PATTERN,
    translationsPattern: TRANSLATIONS_PATTERN
});

const countUntranslatedMessages = R.pipe(
    R.map(R.length),
    R.values,
    R.sum
);

const countDuplicateTranslations = R.pipe(
    R.keys,
    R.length
);

const untranslatedMessages = countUntranslatedMessages(translations.untranslated);
const duplicateTranslations = countDuplicateTranslations(translations.duplicates);

const redOrGreen = (message, value) => {
    const colorFunction = value ? chalk.red : chalk.green;
    return colorFunction(message);
};

const renderMessagesWithoutTranslations = untranslated => {
    const filenames = Object.keys(untranslated);
    if (!filenames.length) {
        console.log(`  ${chalk.green('✓')} ${chalk.grey('You have no messages without translations! The sky is the limit now\n')}`);
        return;
    }
    return filenames.forEach(filename => {
        const messages = untranslated[filename];
        console.log(chalk.grey(filename));
        messages.forEach(message =>
            console.log(`  ${chalk.red('✖')} ${chalk.white(message)}`)
        );
        console.log('');
    });
};

const renderDuplicateTranslations = duplicates => {
    const translations = Object.keys(duplicates);
    if (!translations.length) {
        console.log(`  ${chalk.green('✓')} ${chalk.grey('You have no duplicate translations! Consider yourself a happy camper\n')}`);
        return;
    }
    translations.forEach(translation => {
        console.log(`  ${chalk.red('✖')} ${chalk.white(translation)} appears in ${duplicates[translation]} translations`)
        console.log('');
    });
};

function renderSummary() {
    console.log(`${chalk.white.bold('Messages without translations')}`);
    renderMessagesWithoutTranslations(translations.untranslated);
    console.log(`${chalk.white.bold('Duplicated translations')}`);
    renderDuplicateTranslations(translations.duplicates);
    console.log(`${chalk.white.bold('Summary')}`);
    console.log(`  ${redOrGreen(`${untranslatedMessages} messages without translations`, untranslatedMessages)}, ${redOrGreen(`${duplicateTranslations} duplicate translations.`, duplicateTranslations)}`);
}

renderSummary();
