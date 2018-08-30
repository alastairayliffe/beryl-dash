import React from 'react';
import Refresh from './app/Refresh';
import History from './app/History'

class App extends React.Component {
  
  render() {
    return (
      <div > 
        <div>
            <Refresh />
            <History />
        </div>
      </div>
    );
  }
};


export default App;