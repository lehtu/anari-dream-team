// create component to fetch and display team data
import React, { useState, useEffect } from 'react';
import { API } from '../API.mjs';
import './Teams.css';

export default function Teams() {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        API.getClinchedTeams()
        .then(data => {
            setTeams(data);
            setLoading(false);
        });
    }, []);
    
    return (
        <div className="Teams">
        <h1>Teams</h1>
        {loading && <p>Loading...</p>}
        <ul>
            {teams.map(team => (
                <li key={team.id}><img width="20" src={team.teamLogo} />{team.teamName.default}</li>
            ))}
        </ul>
        </div>
    );
}
