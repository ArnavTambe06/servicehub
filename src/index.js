import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Polyfill for process (if needed)
if (typeof process === 'undefined') {
  window.process = { env: {} };
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);