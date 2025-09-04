import React from 'react';
import { PhoneWidgetTwentyDark } from './modules/telephony/components/PhoneWidget/PhoneWidgetTwentyDark';

function App() {
  return (
    <div className="App" style={{ 
      backgroundColor: '#141414', 
      color: '#ebebeb',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu, sans-serif'
    }}>
      <h1>Twenty Phone Widget Demo</h1>
      <p>Le widget téléphonique apparaîtra en bas à droite de votre écran.</p>
      <PhoneWidgetTwentyDark />
    </div>
  );
}

export default App;