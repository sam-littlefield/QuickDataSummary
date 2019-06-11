import React from 'react';
import ReactDOM from 'react-dom';
import NavBar from './nav/nav';
import appWithRouter from './router';

class App extends React.Component {
  render() {
    return (
			<NavBar handleNavChange={this.handleNavChange} />
    );
  }
}

App = appWithRouter(App);

ReactDOM.render(<App />, document.querySelector('#root'));
