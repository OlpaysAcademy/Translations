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
        <p className="App-intro">
          <FormattedHTMLMessage
            id="App.getting-started"
            defaultMessage="To get started, edit <code>src/App.js</code> and save to reload."
            />
          <FormattedHTMLMessage
            id="App.close-browser"
            defaultMessage="You can also close the browser and see what happens."
            />
        </p>
      </div>
    );
  }
}

export default App;
