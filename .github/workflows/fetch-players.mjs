import { API } from '../../src/API.mjs';
import fs from 'fs';

const players = {
    forwards: [],
    defensemen: [],
    goalies: []
};

const teamAbbrevs = (await API.getClinchedTeams()).map(team => team.teamAbbrev.default);

for (const teamAbbrev of teamAbbrevs) {
    const roster = await API.getTeamRoster(teamAbbrev);
    Object.keys(roster).forEach(role => {
        roster[role].forEach(player => {
            player.currentTeamAbbrev = teamAbbrev;
            player.fullName = player.firstName.default + ' ' + player.lastName.default;
            players[role].push(player);
        });
    });
}

const playersWithStats = (await API.getAllPlayers()).filter(player => teamAbbrevs.includes(player.teamAbbrevs.split(',').slice(-1).shift()));

const positions = {
    'L': 'Left Wing',
    'C': 'Center',
    'R': 'Right Wing',
    'D': 'Defense'
};

Object.keys(players).forEach(role => {
    players[role].forEach((player, index) => {
        const playerWithStats = playersWithStats.find(p => p.playerId === player.id);
        players[role][index] = {
            ...player,
            ...playerWithStats,
            position: positions[player.positionCode],
            teamLogo: {
                light: `https://assets.nhle.com/logos/nhl/svg/${player.currentTeamAbbrev}_light.svg`,
                dark: `https://assets.nhle.com/logos/nhl/svg/${player.currentTeamAbbrev}_dark.svg`,
            },
            playerDetailsUrl: `https://www.nhl.com/player/${player.id}`
        };
        if (!playerWithStats) {
            console.log('no match found:', player.id);
        }
    });
});

fs.writeFileSync('src/players.json', JSON.stringify(players, null, 2));
