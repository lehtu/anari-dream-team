// create component to fetch and display team data
import React, { useState, useEffect, useRef } from 'react';
import teams from '../teams.json';
import stats from '../stats.json';
import './DreamTeams.css';

function getSkaterPoints(playerId) {
    return stats.find(player => player.playerId === playerId)?.points || 0;
}

function getGoaliePoints(playerId) {
    const goalie = stats.find(player => player.playerId === playerId);
    if (!goalie) {
        return 0;
    }
    return goalie.points + goalie.wins + goalie.gamesPlayed;
}

function getTeamPoints(team) {
    let points = 0;
    team.forwards.forEach(player => {
        points += getSkaterPoints(player.id);
    });
    team.defensemen.forEach(player => {
        points += getSkaterPoints(player.id);
    });
    team.goalies.forEach(player => {
        points += getGoaliePoints(player.id);
    });
    return points;
}

export default function DreamTeams() {
    return (
        <div className="Teams">
        <h1><center>Leaderboard</center></h1>
        <table>
            <tr className="headline">
                <th>Team</th>
                <th colspan="3" align='center'>Fordwards</th>
                <th colspan="2" align='center'>Defensemen</th>
                <th align='center'>Goalie</th>
                <th align='center'>Points</th>
            </tr>
            {teams.map(team => (
                <tr key={team.id}>
                    <td>{team.name}</td>
                    {team.team.forwards?.map(player => (
                        <td key={player.id} align="center">
                            <img width="50" src={player.headshot} /><br />
                            <img width="20" src={player.teamLogo.light} />
                            {player.fullName} {getSkaterPoints(player.id)}
                        </td>
                    ))}

                    {team.team.defensemen?.map(player => (
                        <td key={player.id} align="center">
                            <img width="50" src={player.headshot} /><br />
                            <img width="20" src={player.teamLogo.light} />
                            {player.fullName} {getSkaterPoints(player.id)}
                        </td>
                    ))}

                    {team.team.goalies.map(player => (
                        <td key={player.id} align="center">
                            <img width="50" src={player.headshot} /><br />
                            <img width="20" src={player.teamLogo.light} />
                            {player.fullName} {getGoaliePoints(player.id)}
                        </td>
                    ))}
                    <td align='center'>{getTeamPoints(team.team)}</td>
                </tr>
            ))}
        </table>
        </div>
    );
}
