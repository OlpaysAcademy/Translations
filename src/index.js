import React from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider, addLocaleData } from 'react-intl';
import esLocaleData from 'react-intl/locale-data/es';

// addLocaleData is necessary if you are using a locale
// since imports should be statically analizable, we should just load locales for every possible language in our app startup, and load translations on demand (english is already included by default in every component)
addLocaleData(esLocaleData);

import App from './App';
import './index.css';

const locale = 'es';

fetch(`http://localhost:8080?locale=${locale}`).then(res => res.json()).then(({locale, messages}) => {
  ReactDOM.render(
    <IntlProvider locale={locale} messages={messages}>
      <App />
    </IntlProvider>,
    document.getElementById('root')
  );
});
