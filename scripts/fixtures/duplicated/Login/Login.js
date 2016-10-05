import React, { Component } from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';

import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>
            <FormattedMessage
              id="App.welcome"
              defaultMessage={`{gender, select, male{Welcome} female{Welcome} other{Welcome}} to React`}
              values={{ gender: 'male' }}
              />
          </h2>
        </div>
      </div>
    );
  }
}

export default App;
