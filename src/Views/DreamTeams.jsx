// create component to fetch and display team data
import React, { useState, useEffect, useRef } from 'react';
import teams from '../teams.json';
import './DreamTeams.css';

export default function DreamTeams() {
    const [loading, setLoading] = useState(true);
    
    return (
        <div className="Teams">
        <h1>Teams</h1>
        {loading && <p>Loading...</p>}
        <ul>
            {teams.map(team => (
                <li key={team.id}>{team.forwards[0].fullName}</li>
            ))}
        </ul>
        </div>
    );
}
