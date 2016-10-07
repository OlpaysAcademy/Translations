# Translations Workflow

Proposed workflow for working with translations in react apps.

## Objectives

* Handle translations, pluralization, internationalization and genders using react-intl
* Every component should be self-contained, this means it should have its translations in the component's file

## Workflow

* Create component as you normally would
* Add react-intl FormattedMessage to every string that needs to be translated
* Run `node scripts/translations`
* https://speakerdeck.com/tinganho/complex-translation-workflow-and-formatting

Example Output:
```
Messages without translations
    src/App/(white, bold)App.js
        x (white)App.close-browser

Missing translations
    x App.welcome has duplicates, it appears in 2 translation files

Summary
    1 message without translations, 1 duplicate translations
```

## FAQs

* How do I name my translations?

    You should name translations in a format similar to BEM `ComponentName.translation-name`. This allows us to namespace translations.
    Examples:
    * https://github.com/este/este/blob/master/messages/es.js
    * https://github.com/este/este/blob/master/src/browser/auth/Email.js
* How do I reuse translations?

    Every translation needs to have one and only one definition, this means there should be no duplicates. We can achieve this using Component composition, either by component composition or using [Higher Order Components](https://medium.com/@franleplant/react-higher-order-components-in-depth-cf9032ee6c3e).
    * http://stackoverflow.com/questions/34876767/how-to-deal-with-multiple-usage-of-a-react-intl-message
* Dynamic translations?

    * Use react-intl [defineMessages](https://github.com/yahoo/react-intl/wiki/API#definemessages) API
