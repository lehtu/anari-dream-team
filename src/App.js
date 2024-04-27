import React, { useState } from 'react';
import Teams from './Views/Teams';
import Players from './Views/Players';
import DreamTeams from './Views/DreamTeams';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [view, setView] = useState(1);

  return (
    <div className="App">
      <header>
        <h1>🏒 NHL PLayoff: Dream Team Challenge 🏆</h1>
        {view == 1 && <button onClick={() => setView(2)}>join</button>}
      </header>
      <main>
        {view === 1 &&
          <DreamTeams />
        }
        {view === 2 &&
          <Players />
        }
      </main>
      <footer>
        <span>Made by <a href="https://lehtuska.com" target="_blank">lehtuska</a> with <div className="heart">&hearts;</div></span>
      </footer>
    </div>
  );
}

export default App;
