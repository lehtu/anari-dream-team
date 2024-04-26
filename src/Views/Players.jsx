// create component to fetch and display team data
import React, { useState, useEffect, useCallback, useRef } from 'react';
import players from '../players.json';
import './Players.css';

export default function Players() {
    const [team, setTeam] = useState({
        forwards: [],
        defensemen: [],
        goalies: []
    });
    const [role, setRole] = useState('forwards');
    const [loading, setLoading] = useState(true);
    const [disabledTeams, setDisabledTeams] = useState([]);
    const [playerNameFilter, setPlayerNameFilter] = useState('');
    const [hideDisabledTeams, setHideDisabledTeams] = useState(false);

    const handlePlayerClick = useCallback((key) => {
        if (!key) return;

        const myTeam = {...team};
        const player = players[role].find(player => player.id === key);

        // if player is already in the team, remove it
        if (myTeam[role].findIndex(p => p.id === key) > -1) {
            const updateDisabledTeams = disabledTeams.filter(teamAbbrev => teamAbbrev !== player.currentTeamAbbrev);
            setDisabledTeams(updateDisabledTeams);
            myTeam[role] = myTeam[role].filter(p => p.id !== key);
            setTeam(myTeam);
            return;
        }

        // user can't choose players from the same team
        if (disabledTeams.includes(player.currentTeamAbbrev)) {
            alert('You can\'t choose players from the same team');
            return;
        }

        // user can choose only 3 players for forwards, 2 for defensemen, and 1 for goalies
        // first validate forwards
        if (role === 'forwards' && myTeam[role].length === 3) {
            alert('You can only choose 3 forwards');
            return;
        }
        if (role === 'defensemen' && myTeam[role].length === 2) {
            alert('You can only choose 2 defensemen');
            return;
        }
        if (role === 'goalies' && myTeam[role].length === 1) {
            alert('You can only choose 1 goalie');
            return;
        }

        const updateDisabledTeams = [...disabledTeams, player.currentTeamAbbrev];
        setDisabledTeams(updateDisabledTeams);
        myTeam[role].push(player);
        setTeam(myTeam);
    });

    const getURIEncodedTeams = () => {
        const forwards = team.forwards.map(player => ({ id: player.id, fullName: player.fullName, currentTeamAbbrev: player.currentTeamAbbrev }));
        const defensemen = team.defensemen.map(player => ({ id: player.id, fullName: player.fullName, currentTeamAbbrev: player.currentTeamAbbrev }));
        const goalies = team.goalies.map(player => ({ id: player.id, fullName: player.fullName, currentTeamAbbrev: player.currentTeamAbbrev }));

        return encodeURIComponent("# Don't try to edit this message!\n\n```json\n" + JSON.stringify({
            forwards,
            defensemen,
            goalies
        }, null, 2) + "\n```");
    }
    
    return (
        <div className="players">
            <div className="dream-team">
                <h2>Your Dream Team</h2>
                <svg height="20" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="20" data-view-component="true" className="octicon octicon-mark-github v-align-middle color-fg-default">
                    <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                </svg>
                <a href={`https://github.com/lehtu/anari-dream-team/issues/new?title=username&labels=my-anari-team&body=${getURIEncodedTeams()}`} target="_blank">submit!</a>
                <div className="parent">
                    <div className="child title-f">Forwards</div>
                    <div className="child title-d">Defensemen</div>
                    <div className="child title-g">Goalie</div>
                </div>
                <div className="parent">
                    {team.forwards.concat(Array.from({ length: 3 - team.forwards.length }, () => null)).map(player => (
                        <div key={player?.id} className={"child f" + (player?.id && ' selected')} onClick={() => handlePlayerClick(player?.id)}>
                            {player?.currentTeamAbbrev ? <center><img width="100" src={player.headshot} /><br /></center> : <center><img width="100" src='https://assets.nhle.com/mugs/nhl/20232024/CAR/8480031.png' /><br /></center> }
                            {player?.currentTeamAbbrev && <img width="20" src={`https://assets.nhle.com/logos/nhl/svg/${player?.currentTeamAbbrev.toUpperCase()}_light.svg`} />}{player?.fullName || <small>empty</small>}
                        </div>
                    ))}
                    {team.defensemen.concat(Array.from({ length: 2 - team.defensemen.length }, () => null)).map(player => (
                        <div key={player?.id} className={"child d" + (player?.id && ' selected')} onClick={() => handlePlayerClick(player?.id)}>
                            {player?.currentTeamAbbrev ? <center><img width="100" src={player.headshot} /><br /></center> : <center><img width="100" src='https://assets.nhle.com/mugs/nhl/20232024/CAR/8480031.png' /><br /></center> }
                            {player?.currentTeamAbbrev && <img width="20" src={`https://assets.nhle.com/logos/nhl/svg/${player?.currentTeamAbbrev.toUpperCase()}_light.svg`} />}{player?.fullName || <small>empty</small>}
                        </div>
                    ))}
                    {team.goalies.concat(Array.from({ length: 1 - team.goalies.length }, () => null)).map(player => (
                        <div key={player?.id} className={"child g" + (player?.id && ' selected')} onClick={() => handlePlayerClick(player?.id)}>
                            {player?.currentTeamAbbrev ? <center><img width="100" src={player.headshot} /><br /></center> : <center><img width="100" src='https://assets.nhle.com/mugs/nhl/20232024/CAR/8480031.png' /><br /></center> }
                            {player?.currentTeamAbbrev && <img width="20" src={`https://assets.nhle.com/logos/nhl/svg/${player?.currentTeamAbbrev.toUpperCase()}_light.svg`} />}{player?.fullName || <small>empty</small>}
                        </div>
                    ))}
                </div>
            </div>

            <input type="text" value={playerNameFilter} onChange={e => setPlayerNameFilter(e.target.value.toLocaleLowerCase())} placeholder="Filter by player name" />
            <button onClick={() => setRole('forwards')}>Forwards</button>
            <button onClick={() => setRole('defensemen')}>Defensemen</button>
            <button onClick={() => setRole('goalies')}>Goalies</button>
            <button onClick={() => setHideDisabledTeams(!hideDisabledTeams)}>{hideDisabledTeams ? 'Show' : 'Hide'} disabled teams</button>

            <table>
                <tr>
                    <th>Team</th>
                    <th>Headshot</th>
                    <th>Name</th>
                    <th>Goals</th>
                    <th>Assists</th>
                    <th>Points</th>
                    <th>Games Played</th>
                    <th>TOI</th>
                    <th>More</th>
                </tr>
                {players[role]?.filter(player => player.fullName.toLocaleLowerCase().includes(playerNameFilter)).filter(player => !(disabledTeams.includes(player.currentTeamAbbrev) && hideDisabledTeams && !team[role].find(p => p.id === player.id))).map(player => (
                    <tr key={player.id} onClick={() => handlePlayerClick(player.id)} className={(disabledTeams.includes(player.currentTeamAbbrev) && !team[role].find(p => p.id === player.id) ? 'disabled ' : ' ') + (team[role].find(p => p.id === player.id) ? 'selected' : '')}>
                        <td>
                            <img width="20" src={`https://assets.nhle.com/logos/nhl/svg/${player?.currentTeamAbbrev.toUpperCase()}_light.svg`} />
                        </td>
                        <td>
                            <img width="20" src={player.headshot} />
                        </td>
                        <td>
                            {player.fullName} {team[role].find(p => p.id === player.id) && '✅'}
                        </td>
                        <td align='right'>
                            {player.goals}
                        </td>
                        <td align='right'>
                            {player.assists}
                        </td>
                        <td align='right'>
                            {player.points}
                        </td>
                        <td align='right'>
                            {player.gamesPlayed}
                        </td>
                        <td align='right'>
                            {player.timeOnIcePerGame}
                        </td>
                        <td>
                            <a href={player.playerDetailsUrl}>more details</a>
                        </td>
                    </tr>
                ))}
            </table>
        </div>
    );
}
