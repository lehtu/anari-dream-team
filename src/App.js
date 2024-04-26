import React, { useState } from 'react';
import Teams from './Views/Teams';
import Players from './Views/Players';
import DreamTeams from './Views/DreamTeams';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [view, setView] = useState(3);

  return (
    <div className="App">
      {view === 1 &&
        <>
          <h1>What is your name?</h1>
          <label>Username:</label>
          <input type="text" value={username} pattern="/[^a-zA-Z0-9]/{12}" onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))} />
          <button onClick={() => {setView(2)}}>Continue</button>
        </>
      }
      {view === 2 &&
        <>
          <h1>Welcome, {username}!</h1>
          <Teams />
          <hr />
          <button onClick={() => {setView(1)}}>Back</button>
          <button onClick={() => {setView(3)}}>Next</button>
        </>
      }
      {view === 3 &&
        <>
          
          <Players />
          <hr />
          <button onClick={() => {setView(2)}}>Back</button>
          <button onClick={() => {setView(4)}}>Next</button>
        </>
      }
      {view === 4 &&
        <>
          <h1>Thank you, {username}!</h1>
          <DreamTeams />
          <hr />
          <button onClick={() => {setView(3)}}>Back</button>
          <button onClick={() => {setView(4)}}>Next</button>
        </>
      }
    </div>
  );
}

export default App;
