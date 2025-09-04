import React from 'react';
import PhoneWidget from './modules/telephony/components/PhoneWidget';

function App() {
  return (
    <div className="App">
      <h1>Twenty Phone Widget Demo</h1>
      <p>Le widget téléphonique apparaîtra en bas à droite de votre écran.</p>
      <PhoneWidget />
    </div>
  );
}

export default App;