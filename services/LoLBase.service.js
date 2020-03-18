import axios from 'axios'

const riot_host = process.env.RIOT_HOST;
const riot_secret = process.env.RIOT_SECRET;

export default function LoLBaseService() {
    async function getSummonerByName(summoner_name) {
        try {
            const { data } = await axios({
                method: 'GET',
                url: riot_host + '/lol/summoner/v4/summoners/by-name/' + summoner_name,
                params: {
                    api_key: riot_secret
                }
            });
    
            return data
        } catch (err) {
            throw new Error('Failed to fetch summoner by summoner_name')
        }
    }

    async function getMatchesByAccountId(account_id) {
        try {
            const { data } = await axios({
                method: 'GET',
                url: riot_host + '/lol/match/v4/matchlists/by-account/' + account_id,
                params: {
                    api_key: riot_secret,
                    endIndex: 5
                }
            });
    
            return data.matches
        } catch {
            throw new Error('Failed to fetch matches from a summoner by account_id')
        }
    }

    async function getMatchDataById(match_id) {
        try {
            const { data } = await axios({
                method: 'GET',
                url: riot_host + '/lol/match/v4/matches/' + match_id,
                params: {
                    api_key: riot_secret
                }
            });
    
            return data
        } catch {
            throw new Error('Failed to fetch match data from match_id')
        }
    }

    function getChampionItems(stats) {
        const valid_items = [];
        for (let i = 0; i < 7; i++) {
            const item_id = stats['item' + i];
            if (item_id !== 0) {
                valid_items.push(item_id)
            } else {
                valid_items.push(null)
            }
        }
        return valid_items
    }

    function getCreepCount(stats) {
        return stats.totalMinionsKilled + stats.neutralMinionsKilled + stats.neutralMinionsKilledTeamJungle + stats.neutralMinionsKilledEnemyJungle
    }

    return {
        getSummonerStats: async function(summoner_name) {
            const user = await getSummonerByName(summoner_name)
            const matches = await getMatchesByAccountId(user.accountId)
            const matchesDetails = await Promise.all(matches.map(match => getMatchDataById(match.gameId)))
            
            return matchesDetails.map(match => {
                const { teams, gameDuration } = match;
                const identities = match.participantIdentities;
                const players = match.participants;

                const player_id = identities.find(identity => identity.player.accountId === user.accountId).participantId;
                const player_details = players.find(player => player.participantId === player_id);
                const team = teams.find(team => team.teamId === player_details.teamId);
                const score_creep = getCreepCount(player_details.stats);
                const game_duration_mins = gameDuration / 60;

                return {
                    id: match.gameId,
                    victory: team.win === 'Win',
                    game_duration: gameDuration,
                    summoner_name: user.name,
                    summoner_spells: [player_details.spell1Id, player_details.spell2Id],
                    summoner_perks: 'No clue what perks are',
                    champion_name: player_details.championId,
                    champion_level: player_details.stats.champLevel,
                    champion_items: getChampionItems(player_details.stats),
                    score_kills: player_details.stats.kills,
                    score_deaths: player_details.stats.deaths,
                    score_assists: player_details.stats.assists,
                    score_creep,
                    score_creep_per_min: (score_creep / game_duration_mins).toFixed(2)
                }
            })
        }
    }
}