import React from 'react';
import './App.css';
import DashboardPage from './components/DashboardPage'; // Assuming DashboardPage is the correct import path
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <DashboardPage />
      </div>
    </ThemeProvider>
  );
}

export default App;
