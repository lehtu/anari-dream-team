// create component to fetch and display team data
import React, { useState, useEffect, useRef } from 'react';
import { API } from '../API.mjs';
import './DreamTeams.css';

export default function DreamTeams() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const initialized = useRef(false);
    useEffect(() => {
        if (!initialized.current) {
          initialized.current = true
      
          fetch('https://api.github.com/repos/lehtu/anari-dream-team/issues?labels=my-anari-team')
          .then(response => response.json())
          .then(data => {
              const teamsData = data.map(team => ({
                  id: team.id,
                  title: team.title,
                  players: JSON.parse(team.body.split('```json')[1].split('```')[0])
              }));
              setTeams(teamsData);
              setLoading(false);
          });
        }
    }, []);
    
    return (
        <div className="Teams">
        <h1>Teams</h1>
        {loading && <p>Loading...</p>}
        <ul>
            {teams.map(team => (
                <li key={team.id}>{team.title}</li>
            ))}
        </ul>
        </div>
    );
}
