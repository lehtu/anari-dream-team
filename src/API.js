export const API = {
    getSkatersByNationality: async (nationalityCode) => {
        const uri = `https://api.nhle.com/stats/rest/en/skater/bios?cayenneExp=seasonId=20232024 and gameTypeId=2 and nationalityCode="${nationalityCode}"&limit-1`;
        const response = await fetch(uri);
        const result = await response.json();

        //fs.writeFileSync('data/teams.json', JSON.stringify(result, null, 2), 'utf-8');

        return result.data;
    },
    getGoaliesByNationality: async (nationalityCode) => {
        const uri = `https://api.nhle.com/stats/rest/en/goalie/bios?cayenneExp=seasonId=20232024 and gameTypeId=2 and nationalityCode="${nationalityCode}"&limit-1`;
        const response = await fetch(uri);
        const result = await response.json();

        //fs.writeFileSync('data/teams.json', JSON.stringify(result, null, 2), 'utf-8');

        return result.data;
    },
    getPlayersByNationality: async (nationalityCode) => {
        const skaters = await API.getSkatersByNationality(nationalityCode);
        const goalies = await API.getGoaliesByNationality(nationalityCode);

        return {
            skaters,
            goalies
        };
    },
    getTeams: async () => {
        const uri = 'https://api-web.nhle.com/v1/standings/2024-03-16';
        const response = await fetch(uri);
        const result = await response.json();

        //fs.writeFileSync('data/teams.json', JSON.stringify(result, null, 2), 'utf-8');

        return result.standings;
    },
    getTeamRoster: async (teamAbbrev) => {
        const uri = `/v1/roster/${teamAbbrev}/20232024`;
        const response = await fetch(uri);
        const result = await response.json();

        //fs.writeFileSync(`data/team-${teamId}.json`, JSON.stringify(result, null, 2), 'utf-8');

        return result;
    },
    getStandings: async () => {
        const uri = '/v1/standings/2024-04-17';
        const response = await fetch(uri);
        const result = await response.json();

        return result.standings;
    },
    getClinchedTeams: async () => {
        const standings = await API.getStandings();
        const clinched = standings.filter(team => team.hasOwnProperty('clinchIndicator'));

        return clinched;
    },
    getPlayersByRoles: async () => {
        const teams = await API.getClinchedTeams();
        const players = {
          forwards: [],
          defensemen: [],
          goalies: []
        };
    
        for (const team of teams) {
          const playersByRoles = await API.getTeamRoster(team.teamAbbrev.default);
          Object.keys(playersByRoles).forEach(role => {
            playersByRoles[role].forEach(player => {
                player.currentTeamAbbrev = team.teamAbbrev.default;
                player.fullName = player.firstName.default + ' ' + player.lastName.default;
                players[role].push(player);
            });
          });
        }
    
        return Response.json(players)
    }
};

export async function fetchPlayers() {
    const players = await API.getPlayersByNationality('FIN');

    const teamAbbrevs = new Set([...players.skaters.map(skater => skater.currentTeamAbbrev).concat(players.goalies.map(goalie => goalie.currentTeamAbbrev))]);
    const playersInRosterById = [];

    for (const teamAbbrev of teamAbbrevs) {
        const roster = await API.getTeamRoster(teamAbbrev);
        for (const key of Object.keys(roster)) {
            const players = roster[key];
            players.forEach(player => {
                playersInRosterById.push(player.id)
            });
        }
    }

    const playersAPI = [];

    const positions = {
        'L': 'Left Wing',
        'C': 'Center',
        'R': 'Right Wing',
        'D': 'Defense'
    };

    const teams = await API.getTeams();

    let i = 0;
    players.skaters.forEach(player => {
        i++;
        const inRosterFlag = playersInRosterById.includes(player.playerId) ? '✅': '❌';
        const inRosterBool = playersInRosterById.includes(player.playerId) ? true: false;
        //console.log(`${i}. [${player.birthCountryCode}/${player.nationalityCode}] ${player.currentTeamAbbrev} - (${player.positionCode}) - ${player.skaterFullName} ${inRosterFlag}`);

        const team = teams.find(team => team.teamAbbrev.default === player.currentTeamAbbrev);
        playersAPI.push({
            ...player,
            fullName: player.skaterFullName,
            position: positions[player.positionCode],
            headshot: `https://assets.nhle.com/mugs/nhl/20232024/${player.currentTeamAbbrev}/${player.playerId}.png`,
            inRoster: inRosterBool,
            teamPlaceName: team.placeName.default,
            teamName: team.teamName.default,
            teamCommonName: team.teamCommonName.default,
            teamLogo: {
                light: `https://assets.nhle.com/logos/nhl/svg/${player.currentTeamAbbrev}_light.svg`,
                dark: `https://assets.nhle.com/logos/nhl/svg/${player.currentTeamAbbrev}_dark.svg`,
            },
            conferenceName: team.conferenceName,
            divisionName: team.divisionName,
            playerDetailsUrl: `https://www.nhl.com/penguins/player/${player.playerId}`
        });
    });
    players.goalies.forEach(player => {
        i++;
        const inRosterFlag = playersInRosterById.includes(player.playerId) ? '✅': '❌';
        const inRosterBool = playersInRosterById.includes(player.playerId) ? true: false;
        //console.log(`${i}. [${player.birthCountryCode}/${player.nationalityCode}] ${player.currentTeamAbbrev} - (G) - ${player.goalieFullName} ${inRosterFlag}`);

        const team = teams.find(team => team.teamAbbrev.default === player.currentTeamAbbrev);
        playersAPI.push({
            ...player,
            positionCode: 'G',
            position: 'Goalie',
            fullName: player.goalieFullName,
            headshot: `https://assets.nhle.com/mugs/nhl/20232024/${player.currentTeamAbbrev}/${player.playerId}.png`,
            inRoster: inRosterBool,
            teamPlaceName: team.placeName.default,
            teamName: team.teamName.default,
            teamCommonName: team.teamCommonName.default,
            teamLogo: {
                light: `https://assets.nhle.com/logos/nhl/svg/${player.currentTeamAbbrev}_light.svg`,
                dark: `https://assets.nhle.com/logos/nhl/svg/${player.currentTeamAbbrev}_dark.svg`,
            },
            conferenceName: team.conferenceName,
            divisionName: team.divisionName,
            playerDetailsUrl: `https://www.nhl.com/penguins/player/${player.playerId}`
        });
    });

    return playersAPI;
}

//fs.writeFileSync(`${process.cwd()}/app/players.json`, JSON.stringify(playersAPI, null, 2));

// const teams = await API.getTeams();
// const rosters = {};

// for (const team of teams) {
//     const roster = await API.getTeamRoster(team.teamAbbrev.default);
//     rosters[team.teamAbbrev.default] = roster;

//     await new Promise(resolve => setTimeout(() => resolve(), 200));
// }

// const finns = [];

// for (const key of Object.keys(rosters)) {
//     const roster = rosters[key];
//     roster.forwards.forEach(forward => {
//         if (forward.birthCountry === 'FIN') {
//             finns.push({...forward, type: 'forward', teamAbbrev: key})
//         }
//     });
//     roster.defensemen.forEach(defense => {
//         if (defense.birthCountry === 'FIN') {
//             finns.push({...defense, type: 'defense', teamAbbrev: key})
//         }
//     });
//     roster.goalies.forEach(goalie => {
//         if (goalie.birthCountry === 'FIN') {
//             finns.push({...goalie, type: 'goalie', teamAbbrev: key})
//         }
//     });
// }

// finns.forEach((finn, index) => {
//     console.log(index, finn.teamAbbrev, finn.firstName.default, finn.lastName.default);
// });