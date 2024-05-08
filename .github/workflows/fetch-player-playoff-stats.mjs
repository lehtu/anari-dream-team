import { API } from '../../src/API.mjs';
import fs from 'fs';

const teamAbbrevs = (await API.getClinchedTeams()).map(team => team.teamAbbrev.default);
const playersWithStats = (await API.getAllPlayers(3)).filter(player => teamAbbrevs.includes(player.teamAbbrevs.split(',').slice(-1).shift()));

const currentStats = JSON.parse(fs.readFileSync('../../src/stats.json', 'utf8'));

let diffs = 0;

playersWithStats.forEach(player => {
    const current = currentStats.find(p => p.playerId === player.playerId);
    if (current) {
        if (current.points !== player.points) {
            diffs++;
        }
    }
});

if (diffs === 0) {
    console.log('no updates');
    process.exit(1);
}

fs.writeFileSync('../../src/stats.json', JSON.stringify(playersWithStats, null, 2));
