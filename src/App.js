import React from 'react';
import Receipt from './Receipt';
import './App.css';
import { BrowserRouter } from 'react-router-dom';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Receipt />
      </BrowserRouter>
    </div>
  );
};

export default App;
