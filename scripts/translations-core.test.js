import checkTranslations from './translations-core';

test('returns untranslated keys id and file', () => {
    const result = checkTranslations({
        componentsPattern: './scripts/fixtures/untranslated/**/*.js',
        translationsPattern: './scripts/fixtures/untranslated/**/*.json'
    });
    expect(result.untranslated['./scripts/fixtures/untranslated/App.js']).toEqual(['App.close-browser']);
});

test('returns duplicated keys', () => {
    const result = checkTranslations({
        componentsPattern: './scripts/fixtures/duplicated/**/*.js',
        translationsPattern: './scripts/fixtures/duplicated/**/*.json'
    });
    expect(result.duplicates['App.welcome']).toEqual(2);
});