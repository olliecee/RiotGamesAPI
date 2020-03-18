import LoLBaseService from '../services/LoLBase.service';

export const getSummonerStats = async (req, res, next) => {
    try {
        if (!('summoner_name' in req.params)) {
            throw new Error('You require a summoner_name to make that request')
        }

        const { summoner_name } = req.params;

        if (!summoner_name) {
            throw new Error('That summoner_name is invalid')
        }

        const LoLService = new LoLBaseService();
        const summoner_match_stats = await LoLService.getSummonerStats(summoner_name);

        res.json(summoner_match_stats)
    } catch (err) {
        console.log(err);
        next('Unable to retrieve summoner stats')
    }
};