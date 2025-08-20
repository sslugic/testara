import React from 'react';
import TestManagerPortal from './components/TestManagerPortal';
import './App.css';

function App() {
  // No network calls or API connections - everything uses localStorage
  console.log('App starting - localStorage mode only');
  
  return (
    <div className="App">
      <TestManagerPortal />
    </div>
  );
}

export default App;