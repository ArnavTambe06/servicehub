import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './App.css';

/* ReactDOM.render is no longer supported in React 18.
   Create a root and render your app like this: */
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);