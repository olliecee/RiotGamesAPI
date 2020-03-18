// Imports
import express from 'express';
import cors from 'cors';

import { getSummonerStats } from './controllers/LeagueOfLegends.controller';

// Declarations
const app = express()
const port = process.env.PORT;

// Settings
const whitelist = ['http://localhost', 'https://olliecee.com']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

// Middleware
app.use(cors(corsOptions))

// Routes
app.get('/summoner/:summoner_name', getSummonerStats)

// Launching the service
app.listen(port, () => console.log(`Back end server listening on port ${port}!`))